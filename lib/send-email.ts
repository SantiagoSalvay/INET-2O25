import nodemailer from 'nodemailer';

export async function sendEmail({
  to,
  subject,
  text,
  html
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  // Configura el transporter con tus credenciales reales o variables de entorno
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'usuario@example.com',
      pass: process.env.SMTP_PASS || 'password',
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@empresa.com',
    to,
    subject,
    text,
    html,
  });
} 