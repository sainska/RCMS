const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const emailMode = (process.env.EMAIL_MODE || '').toLowerCase(); // 'sandbox' to use Ethereal
  const useService = process.env.EMAIL_SERVICE; // e.g., 'gmail' or 'ethereal'

  let transporter;

  if (emailMode === 'sandbox' || useService === 'ethereal') {
    // Auto-provision an Ethereal test account for sandboxed emails
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    const port = Number(process.env.EMAIL_PORT) || 587;
    const transportConfig = useService
      ? {
          service: useService,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        }
      : {
          host: process.env.EMAIL_HOST,
          port,
          secure: port === 465, // true for 465 (SSL), false for 587/25 (STARTTLS/plain)
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        };
    transporter = nodemailer.createTransport(transportConfig);
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"RCMS Support" <support@rcms.local>',
    to,
    subject,
    html,
    text: html?.replace(/<[^>]+>/g, ' ').trim(), // basic plaintext fallback
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response || info.messageId);
    // If using Ethereal sandbox, print preview URL
    const preview = nodemailer.getTestMessageUrl?.(info);
    if (preview) {
      console.log('🔗 Preview URL:', preview);
    }
    return { info, preview };
  } catch (error) {
    console.error('❌ Email error:', error?.message || error);
    throw error;
  }
};

module.exports = sendEmail;
