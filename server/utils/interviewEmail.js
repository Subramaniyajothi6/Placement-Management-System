const nodemailer = require('nodemailer');
const { EMAIL_PASS, EMAIL } = require('./config'); // Or use process.env directly

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL || EMAIL,
    pass: process.env.EMAIL_PASS || EMAIL_PASS,
  },
});

async function InterviewEmail(toEmail, interview) {
  try {
    const baseAppUrl = 'http://localhost:5173'; // Update with your frontend URL

    const meetingUrl = interview.meetingId
      ? `${baseAppUrl}/student/${interview.meetingId}`
      : '';

    // Generate HTML for attachments list
    const attachmentListHtml = interview.attachments && interview.attachments.length
      ? `<ul>${interview.attachments.map(att =>
          `<li><a href="${att.url}" target="_blank" rel="noopener">${att.name || att.url}</a></li>`
        ).join('')}</ul>`
      : '<p>No attachments provided.</p>';

    const mailOptions = {
      from: `"Placement Team" <${EMAIL}>`,
      to: toEmail,
      subject: `Interview Scheduled: ${interview.job?.title || 'Your Interview'}`,
      html: `
        <p>Dear Student,</p>
        <p>Your interview for the job <strong>${interview.job?.title || ''}</strong> has been scheduled.</p>
        <p><strong>Date & Time:</strong> ${new Date(interview.interviewDate).toLocaleString()}</p>
        <p><strong>Location/Link:</strong> ${
          interview.interviewType === 'Online' && meetingUrl
            ? `<a href='${meetingUrl}'>Join Jitsi Meet Interview</a>`
            : interview.location || 'To be decided'
        }</p>
        <p><strong>Attachments:</strong></p>
        ${attachmentListHtml}
        <p>Please be prepared and be on time.</p>
        <p>Best regards,<br/>Placement Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Interview email sent to ${toEmail}`);
  } catch (err) {
    console.error(`Failed to send interview email to ${toEmail}:`, err);
  }
}

module.exports = {
  InterviewEmail,
};
