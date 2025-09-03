const nodemailer = require('nodemailer');
const { EMAIL_PASS, EMAIL } = require('./config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS
  },
});

// Helper to generate the right email content based on type
function getMailContent({ type, interview, companyProfile, job }) {
  switch (type) {
    case 'result':
      return {
        subject: `Your Interview Result for ${job.title}`,
        text:
`Dear Candidate,

Thank you for attending the interview for the role of ${job.title}.

Result: ${interview.result}
Score: ${typeof interview.score === 'number' ? interview.score : 'N/A'}
Feedback: ${interview.feedback || 'No feedback provided'}

Best regards,
${companyProfile?.name || 'Company Team'}
`
      }
    default: // 'schedule' or unrecognized, fallback to default
      return {
        subject: `Interview Scheduled for Role: ${job.title}`,
        text:
`Dear Candidate,

Your interview has been scheduled as follows:

Job: ${job.title}
Date & Time: ${new Date(interview.interviewDate).toLocaleString()}
Duration: ${interview.durationMinutes} minutes
Type: ${interview.interviewType}
${interview.location ? 'Location: ' + interview.location : ''}
${interview.meetingId ? 'Meeting Link/ID: ' + interview.meetingId : ''}
Round: ${interview.round}

Please be prepared accordingly.

Best regards,
${companyProfile?.name || 'Company Team'}
`
      }
  }
}

// Send interview notification or result email
async function sendInterviewEmail(toEmail, interview, companyProfile, job, type) {
  // Choose email template type based on passed type or interview.result
  const emailType = type || 
    (interview.result && interview.result !== 'Pending' ? 'result' : 'schedule');

  const { subject, text } = getMailContent({ type: emailType, interview, companyProfile, job });

  const mailOptions = {
    from: `"${companyProfile?.name || 'Company Team'}" <no-reply@${companyProfile?.name || 'companyteam.com'}>`,
    to: toEmail,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendInterviewEmail };
