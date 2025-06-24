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

export async function sendVerificationEmail({
  to,
  nombre,
  verificationUrl
}: {
  to: string;
  nombre: string;
  verificationUrl: string;
}) {
  const subject = 'Verifica tu cuenta en TravelWeb';
  const html = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; padding: 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); overflow: hidden;">
      <tr>
        <td style="padding: 32px 32px 16px 32px; text-align: center;">
          <img src='https://inet-2o25.vercel.app/placeholder-logo.png' alt='INET 2025' width='64' style='margin-bottom: 16px;'/>
          <h2 style="color: #2563eb; margin: 0 0 8px 0; font-size: 1.5rem;">¡Bienvenido/a, ${nombre}!</h2>
          <p style="color: #222; font-size: 1rem; margin: 0 0 24px 0;">Gracias por registrarte en <b>INET 2025</b>.<br>Para activar tu cuenta, por favor verifica tu email.</p>
          <a href="${verificationUrl}" style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none; font-weight: 600; padding: 14px 32px; border-radius: 8px; font-size: 1.1rem; margin-bottom: 16px;">Verificar mi cuenta</a>
          <p style="color: #888; font-size: 0.95rem; margin: 24px 0 0 0;">Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
        </td>
      </tr>
      <tr>
        <td style="background: #f4f6fb; color: #888; text-align: center; font-size: 0.9rem; padding: 16px 32px;">
          © ${new Date().getFullYear()} INET 2025. Todos los derechos reservados.
        </td>
      </tr>
    </table>
  </div>
  `;
  await sendEmail({ to, subject, html });
}

export async function sendOrderStatusEmail({
  to,
  nombre,
  estado,
  pedido
}: {
  to: string;
  nombre: string;
  estado: string;
  pedido: any;
}) {
  const subject = `Actualización de estado de tu pedido: ${estado}`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; padding: 32px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); overflow: hidden;">
        <tr>
          <td style="padding: 32px 32px 16px 32px; text-align: center;">
            <img src='https://inet-2o25.vercel.app/placeholder-logo.png' alt='INET 2025' width='64' style='margin-bottom: 16px;'/>
            <h2 style="color: #2563eb; margin: 0 0 8px 0; font-size: 1.3rem;">Hola, ${nombre}!</h2>
            <p style="color: #222; font-size: 1rem; margin: 0 0 16px 0;">El estado de tu pedido <b>${pedido.numero_pedido || pedido.id}</b> ha cambiado a:</p>
            <div style="display:inline-block; background:#2563eb; color:#fff; border-radius:6px; padding:8px 20px; font-weight:600; font-size:1.1rem; margin-bottom:16px;">${estado}</div>
            <div style="margin: 18px 0 0 0; text-align:left;">
              <p style="color:#222; font-size:1rem; margin-bottom:8px;"><b>Resumen del pedido:</b></p>
              <ul style="color:#444; font-size:0.98rem; margin:0; padding-left:18px;">
                <li><b>Fecha:</b> ${new Date(pedido.fecha_pedido).toLocaleString()}</li>
                <li><b>Total:</b> $${pedido.total}</li>
                <li><b>Estado actual:</b> ${estado}</li>
              </ul>
            </div>
            <p style="color: #888; font-size: 0.95rem; margin: 24px 0 0 0;">Si tienes dudas, responde a este email o contáctanos desde la web.</p>
          </td>
        </tr>
        <tr>
          <td style="background: #f4f6fb; color: #888; text-align: center; font-size: 0.9rem; padding: 16px 32px;">
            © ${new Date().getFullYear()} INET 2025. Todos los derechos reservados.
          </td>
        </tr>
      </table>
    </div>
  `;
  await sendEmail({ to, subject, html });
} 