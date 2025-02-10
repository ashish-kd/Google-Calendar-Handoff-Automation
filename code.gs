/**
 * Triggered when a new Google Calendar event is created.
 * Extracts participant emails, creates a shared folder, and sends a form to Participant B.
 */
function onCalendarEventCreated(e) {
    Logger.log("Calendar Event Created Triggered", e);
    
    try {
        var calendarId = e.calendarId; //Calendar ID
        var now = new Date();
        var fifteenMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        
        // Fetch recently updated events from the calendar
        var events = Calendar.Events.list(calendarId, {
            updatedMin: fifteenMinutesAgo.toISOString(),
            orderBy: "updated",
            singleEvents: true
        });

        if (!events.items || events.items.length === 0) {
            Logger.log("No recently created events found.");
            return;
        }

        var lastEvent = events.items[events.items.length - 1]; // Most recently created event
        Logger.log("Last Created Event: " + lastEvent.summary);

        // Ensure the event has at least two attendees
        if (!lastEvent.attendees || lastEvent.attendees.length < 2) {
            Logger.log("Not enough participants for a handoff.");
            return;
        }

        var participantAEmail = lastEvent.attendees[0].email;
        var participantBEmail = lastEvent.attendees[1].email;
        
        // Store participant emails for later retrieval
        PropertiesService.getScriptProperties().setProperty("participantAEmail", participantAEmail);
        PropertiesService.getScriptProperties().setProperty("participantBEmail", participantBEmail);

        // Create a shared folder in Google Drive
        var folderName = `[${participantAEmail} + ${participantBEmail} Handoff]`;
        var driveFolder = DriveApp.createFolder(folderName);
        Logger.log("Created Folder: " + folderName);
        
        // Share the folder with Participant A
        driveFolder.addEditor(participantAEmail);
        Logger.log("Shared Folder with: " + participantAEmail);

        // Store folder ID for later use
        PropertiesService.getScriptProperties().setProperty("handoffFolderId", driveFolder.getId());

        // Send form to Participant B
        sendForm(participantBEmail);

    } catch (error) {
        Logger.log("Error in onCalendarEventCreated: " + error.message);
    }
}

/**
 * Sends the handoff form link via email to the specified participant.
 */
function sendForm(emailAddress) {
    try {
        var formId = "1k48b06fGPj6oqdjjpkZgscpBuhzhComjGyrQDWUJYd4"; // Google Form ID
        var formUrl = "https://docs.google.com/forms/d/" + formId + "/viewform";
        
        var subject = "Please Fill Out This Handoff Form";
        var body = "Dear Participant,\n\nPlease fill out the Handoff form using the following link:\n\n" + formUrl;
    
        MailApp.sendEmail(emailAddress, subject, body);
        Logger.log("Form sent to: " + emailAddress);
    } catch (error) {
        Logger.log("Error sending form: " + error.message);
    }
}

/**
 * Triggered when a Google Form response is submitted.
 * Generates a PDF summary, stores it in a shared Google Drive folder, and notifies both participants.
 */
function onFormSubmit(e) {
    try {
        var formId = '1k48b06fGPj6oqdjjpkZgscpBuhzhComjGyrQDWUJYd4'; // Google Form ID
        var form = FormApp.openById(formId);
        var formResponses = form.getResponses();
        var formCount = formResponses.length;

        if (formCount === 0) {
            Logger.log("No form responses found.");
            return;
        }

        var formResponse = formResponses[formCount - 1];
        var itemResponses = formResponse.getItemResponses();
        var responseText = "**Handoff Details:**\n\n";

        for (var j = 0; j < itemResponses.length; j++) {
            var itemResponse = itemResponses[j];
            var title = itemResponse.getItem().getTitle();
            var answer = itemResponse.getResponse();
            responseText += `${title}: ${answer}\n`;
        }

        Logger.log("Form Response:\n" + responseText);

        var pdfBlob = Utilities.newBlob(responseText, "application/pdf").setName("Handoff_Details.pdf");

        // Retrieve stored folder ID
        var folderId = PropertiesService.getScriptProperties().getProperty("handoffFolderId");
        if (!folderId) {
            Logger.log("No folder ID stored in script properties.");
            return;
        }

        var folder = DriveApp.getFolderById(folderId);
        var pdfFile = folder.createFile(pdfBlob);
        Logger.log("PDF Saved: " + pdfFile.getName());

        // Retrieve participant emails
        var participantAEmail = PropertiesService.getScriptProperties().getProperty("participantAEmail");
        var participantBEmail = PropertiesService.getScriptProperties().getProperty("participantBEmail");

        if (!participantAEmail || !participantBEmail) {
            Logger.log("Missing participant emails.");
            return;
        }

        // Send Email Notifications
        var subject = "Handoff Completed: " + pdfFile.getName();
        var body = `Dear Participants,\n\nYour handoff document has been generated and stored in:\n ${pdfFile.getUrl()}\n\nBest,\nAutomated System`;

        MailApp.sendEmail(participantAEmail, subject, body);
        MailApp.sendEmail(participantBEmail, subject, body);
        Logger.log("Notification sent to both participants.");

    } catch (error) {
        Logger.log("Error in onFormSubmit: " + error.message);
    }
}
