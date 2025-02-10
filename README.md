# 📅 Google Calendar Handoff Automation  

This Google Apps Script automates the handoff process by:  
1. Detecting new calendar events.  
2. Creating a shared Google Drive folder for handoff.  
3. Sending a Google Form to a participant.  
4. Storing form responses as a PDF in the shared folder.  
5. Notifying participants via email.  

---

## 📌 Features  
✅ Detects new events with at least two participants.  
✅ Creates a Google Drive folder for the handoff.  
✅ Sends a Google Form to a participant for details.  
✅ Converts form responses into a PDF.  
✅ Stores the PDF in the shared folder.  
✅ Notifies participants via email.  

---

## 🚀 Setup Instructions  

### 1️⃣ Deploy the Script  
1. Open [Google Apps Script](https://script.google.com/).  
2. Create a new project.  
3. Copy and paste the script into the editor.  

### 2️⃣ Enable Required Services  
- In **Apps Script Editor**, go to:  
  - **Services** > Enable **Google Drive API**  
  - **Services** > Enable **Google Calendar API**  

### 3️⃣ Set Up Triggers  
- **Calendar Event Trigger**  
  - In **Triggers** > Add a trigger for `onCalendarEventCreated`  
  - Choose **Event Source** → `From Calendar`  
  - Choose **Event Type** → `On event creation`  
  - Set Calendar ID (your Google account email).  

- **Form Submission Trigger**  
  - In **Triggers** > Add a trigger for `onFormSubmit`  
  - Choose **Event Source** → `From form`  
  - Choose **Event Type** → `On form submit`.  

---

## 🛠 How It Works  

1. **Calendar Event Created**  
   - Detects new event with **at least 2 attendees**.  
   - Creates a Google Drive folder for the handoff.  
   - Shares the folder with **Participant A**.  
   - Sends a Google Form to **Participant B**.  

2. **Participant B Submits the Form**  
   - Captures form responses.  
   - Converts responses into a **PDF**.  
   - Saves the PDF inside the shared folder.  
   - Sends an email to both participants with the folder link.  

---

## 📧 Notifications  
- **Participant A** gets access to the shared folder.  
- **Participant B** receives the form.  
- Once the form is submitted, both **get an email** with the handoff details and folder link.  

---

## ⚠️ Error Handling  
- Logs errors in **Apps Script Logs (`Logger.log()`)**.  
- Skips event processing if:  
  - There are fewer than 2 participants.  
  - Form responses are missing.  
  - Google Drive folder cannot be created.  
- Ensures **duplicate triggers** are not created.  

---

## 🔗 Links  
- **Google Apps Script**: [script.google.com](https://script.google.com/)  
- **Google Drive**: [drive.google.com](https://drive.google.com/)  
- **Google Calendar**: [calendar.google.com](https://calendar.google.com/)  

---
