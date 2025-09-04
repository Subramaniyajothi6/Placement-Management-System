const nodemailer = require('nodemailer');
const { EMAIL_PASS, EMAIL } = require('./config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

async function InterviewEmail(toEmail, interview) {
  try {
    const mailOptions = {
      from: `"Placement Team" <${EMAIL}>`,
      to: toEmail,
      subject: `Interview Scheduled: ${interview.job?.title || 'Your Interview'}`,
      html: `
        <p>Dear Student,</p>
        <p>Your interview for the job <strong>${interview.job?.title || ''}</strong> has been scheduled.</p>
        <p><strong>Date & Time:</strong> ${new Date(interview.interviewDate).toLocaleString()}</p>
        <p><strong>Location/Link:</strong> ${
          interview.interviewType === 'Online'
            ? `<a href='https://zoom.us/j/${interview.meetingId}'>Zoom Meeting Link</a>`
            : interview.location || 'To be decided'
        }</p>
        <p>Please be prepared and be on time.</p>
        <p>Best regards,<br/>Placement Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Interview email sent to ${toEmail}`);
  } catch (err) {
    console.error(`Failed to send interview email to ${toEmail}:`, err);
    throw err; // or just log if you want to ignore failures
  }
}

module.exports = {
  InterviewEmail,
};
