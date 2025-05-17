const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Event = require('../models/Event');
const User = require('../models/User');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send reminder email
const sendReminderEmail = async (user, event) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Reminder: ${event.name}`,
    html: `
      <h1>Event Reminder</h1>
      <p>This is a reminder for your upcoming event:</p>
      <h2>${event.name}</h2>
      <p><strong>Description:</strong> ${event.description}</p>
      <p><strong>Date:</strong> ${event.date.toLocaleString()}</p>
      <p><strong>Category:</strong> ${event.category}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent for event: ${event.name}`);
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
};

// Check for events that need reminders
const checkReminders = async () => {
  try {
    const now = new Date();
    const events = await Event.find({
      'reminder.enabled': true,
      'reminder.time': { $lte: now },
      date: { $gt: now }
    }).populate('user');

    for (const event of events) {
      await sendReminderEmail(event.user, event);
      
      // Disable reminder after sending
      event.reminder.enabled = false;
      await event.save();
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

// Schedule reminder check every minute
cron.schedule('* * * * *', checkReminders);

module.exports = {
  sendReminderEmail,
  checkReminders
}; 