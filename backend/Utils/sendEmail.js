const nodeMailer = require('nodemailer'); // Importing nodemailer for sending emails

const sendEmail = async (options) => {
  let transporter;

  const hasEnv = !!(process.env.SMTP_HOST || process.env.SMTP_SERVICE);

  if (hasEnv) {
    transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      service: process.env.SMTP_SERVICE,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } else {
    // Dev fallback: use Ethereal test account if no SMTP config provided
    const testAccount = await nodeMailer.createTestAccount();
    transporter = nodeMailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const mailOptions = {
    from: `${process.env.FROM_NAME || 'Dev Mailer'} <${process.env.FROM_EMAIL || 'no-reply@example.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(mailOptions);

  // In dev, surface the preview URL to help debug
  if (!hasEnv) {
    const previewUrl = nodeMailer.getTestMessageUrl(info);
    if (previewUrl) {
      // eslint-disable-next-line no-console
      console.log('Preview email URL:', previewUrl);
    }
  }
};

module.exports = sendEmail;