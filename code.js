// Serve the HTML contact form
function doGet() {
    return HtmlService.createHtmlOutputFromFile('index');
  }
  
  // Handle form submission: save to sheet and send emails
  function handleFormSubmit(form) {
    const sheet = SpreadsheetApp.openById('1iGCOrXT_klD070PUQuxPtmGMpccCeMAGCZfHcLVPoVg').getSheetByName('Sheet1');
    sheet.appendRow([new Date(), form.name, form.email, form.message, "Pending"]);
  
    // Email confirmation to user
    GmailApp.sendEmail(
      form.email,
      "Thanks for contacting us!",
      "Hi " + form.name + ",\n\nThank you for reaching out. We'll get back to you soon!\n\nBest regards,\nYour Team"
    );
  
    // Email notification to admin
    GmailApp.sendEmail(
      "ADMIN_EMAIL@example.com",  // ← Replace this with your real email
      "New Contact Form Submission",
      `📬 New Entry:\n\nName: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`
    );
  
    return "Thanks! Your message has been submitted.";
  }
  
  // Batch email sending for unsent responses
  function sendBatchEmails() {
    const sheet = SpreadsheetApp.openById('1iGCOrXT_klD070PUQuxPtmGMpccCeMAGCZfHcLVPoVg').getSheetByName('Sheet1');
    const data = sheet.getDataRange().getValues();
  
    for (let i = 1; i < data.length; i++) { 
      const [timestamp, name, email, message, status] = data[i];
  
      if (email && name && message && status !== 'Sent') {
        GmailApp.sendEmail(
          email,
          "Thanks for contacting us!",
          `Hi ${name},\n\nThanks for reaching out. We appreciate your message!\n\nBest,\nYour Team`
        );
  
        // Update the status to "Sent"
        sheet.getRange(i + 1, 5).setValue("Sent");
      }
    }
  }
  
  function onOpen() {
    SpreadsheetApp.getUi()
      .createMenu('📧 Email Tools')
      .addItem('Send Batch Emails', 'sendBatchEmails')
      .addToUi();
  }
  