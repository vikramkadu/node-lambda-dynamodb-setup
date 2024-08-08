import nodemailer from 'nodemailer';

const sendPin = async (email: string, pin: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your 4-digit PIN',
    text: `Your 4-digit PIN is ${pin}`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendPin;
