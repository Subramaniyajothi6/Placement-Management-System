const nodemailer = require('nodemailer');
const { EMAIL_PASS, EMAIL } = require('./config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS,
  },
});

// Helper to generate the right email content based on type and result
function getMailContent({ type, interview, companyProfile, job }) {
  switch (type) {
    case 'result':
      {
        // Common score and feedback text, with fallback if not provided
        const scoreText = `Score: ${typeof interview.score === 'number' ? interview.score : 'N/A'}`;
        const feedbackText = `Feedback: ${interview.feedback || 'No feedback provided'}`;

        switch (interview.result?.toLowerCase()) {
          case 'shortlisted':
            return {
              subject: `Congratulations! You have been shortlisted for ${job.title}`,
              text: `Dear Candidate,

We are pleased to inform you that you have been shortlisted for the position of ${job.title}.

${scoreText}
${feedbackText}

Please await further instructions from the recruitment team.

Best regards,
${companyProfile?.name || 'Company Team'}
`,
            };
          case 'rejected':
            return {
              subject: `Interview Result for ${job.title}`,
              text: `Dear Candidate,

Thank you for your interest and time. Unfortunately, we will not be moving forward with your application for the position of ${job.title}.

${scoreText}
${feedbackText}

We wish you the best in your job search.

Best regards,
${companyProfile?.name || 'Company Team'}
`,
            };
          case 'hired':
            return {
              subject: `Congratulations! You have been hired for ${job.title}`,
              text: `Dear Candidate,

We are excited to offer you the position of ${job.title} at ${companyProfile?.name || 'our company'}.

${scoreText}
${feedbackText}

Please contact us to discuss the next steps.

Best regards,
${companyProfile?.name || 'Company Team'}
`,
            };
          default:
            // fallback for any other result value
            return {
              subject: `Your Interview Result for ${job.title}`,
              text: `Dear Candidate,

Your interview result for the position of ${job.title} is: ${interview.result}

${scoreText}
${feedbackText}

Best regards,
${companyProfile?.name || 'Company Team'}
`,
            };
        }
      }
    default:
      // Scheduling or other emails
      return {
        subject: `Interview Scheduled for Role: ${job.title}`,
        text: `Dear Candidate,

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
`,
      };
  }
}

// Send interview notification or result email
async function sendInterviewEmail(toEmail, interview, companyProfile, job, type) {
  // Determine email type from argument or interview.result
  let emailType = type;

  if (!emailType) {
    if (!interview.result || interview.result.toLowerCase() === 'pending') {
      console.log('Interview result is pending; no email sent.');
      return; // Do NOT send email if result is pending or absent
    }
    emailType = 'result';
  }

  const { subject, text } = getMailContent({ type: emailType, interview, companyProfile, job });

  const mailOptions = {
    from: `"${companyProfile?.name || 'Company Team'}" <no-reply@${companyProfile?.name || 'companyteam.com'}>`,
    to: toEmail,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendInterviewEmail,
};
