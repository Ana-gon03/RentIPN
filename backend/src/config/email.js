const enviarEmail = async ({ to, subject, html, nombre }) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'RentIPN',
        email: process.env.BREVO_EMAIL_SENDER,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Brevo API error: ${err}`);
  }

  return await response.json();
};

const enviarCodigoVerificacion = async (destinatario, codigo, nombre) => {
  try {
    await enviarEmail({
      to: destinatario,
      subject: 'Verifica tu cuenta - RentIPN',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Verifica tu cuenta</title></head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <div style="text-align: center; border-bottom: 2px solid #5e60ce; padding-bottom: 15px; margin-bottom: 20px;">
              <h1 style="color: #5e60ce; margin: 0;">🏠 RentIPN</h1>
              <p style="color: #666; margin: 5px 0 0;">Vivienda para estudiantes IPN</p>
            </div>
            <h2 style="color: #333;">¡Bienvenido a RentIPN, ${nombre}!</h2>
            <p style="color: #555; line-height: 1.5;">Gracias por registrarte. Para completar tu registro ingresa el siguiente código:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 36px; letter-spacing: 8px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
              ${codigo}
            </div>
            <p style="color: #555;">Este código expira en <strong>24 horas</strong>.</p>
            <p style="color: #555;">Si no solicitaste este registro, puedes ignorar este correo.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999; text-align: center;">
              RentIPN - Plataforma de vivienda para estudiantes del IPN<br>
              Este es un correo automático, por favor no responder.
            </p>
          </div>
        </body>
        </html>
      `,
    });
    console.log('✅ Correo enviado a:', destinatario);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar correo:', error.message);
    return false;
  }
};

const reenviarCodigoVerificacion = async (destinatario, codigo, nombre) => {
  return await enviarCodigoVerificacion(destinatario, codigo, nombre);
};

const enviarCorreoContacto = async (nombre, email, mensaje) => {
  try {
    await enviarEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `📩 Nuevo mensaje de contacto - ${nombre}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Nuevo mensaje de contacto</title></head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <div style="text-align: center; border-bottom: 2px solid #5e60ce; padding-bottom: 15px; margin-bottom: 20px;">
              <h1 style="color: #5e60ce; margin: 0;">🏠 RentIPN</h1>
              <p style="color: #666; margin: 5px 0 0;">Nuevo mensaje de contacto</p>
            </div>
            <p><strong>De:</strong> ${nombre}</p>
            <p><strong>Correo:</strong> ${email}</p>
            <hr />
            <p><strong>Mensaje:</strong></p>
            <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${mensaje}</p>
            <hr style="margin: 20px 0;" />
            <p style="font-size: 12px; color: #999; text-align: center;">
              Este mensaje fue enviado desde el formulario de contacto de RentIPN
            </p>
          </div>
        </body>
        </html>
      `,
    });
    console.log('✅ Correo de contacto enviado a admin');
    return true;
  } catch (error) {
    console.error('❌ Error al enviar correo de contacto:', error.message);
    return false;
  }
};

const enviarCodigoRecuperacion = async (destinatario, codigo) => {
  try {
    await enviarEmail({
      to: destinatario,
      subject: 'Recupera tu contraseña - RentIPN',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Recuperar contraseña</title></head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <div style="text-align: center; border-bottom: 2px solid #5e60ce; padding-bottom: 15px; margin-bottom: 20px;">
              <h1 style="color: #5e60ce; margin: 0;">🏠 RentIPN</h1>
              <p style="color: #666; margin: 5px 0 0;">Recuperación de contraseña</p>
            </div>
            <h2 style="color: #333;">Restablecer tu contraseña</h2>
            <p style="color: #555; line-height: 1.5;">Recibimos una solicitud para restablecer tu contraseña. Usa este código:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 36px; letter-spacing: 8px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
              ${codigo}
            </div>
            <p style="color: #555;">Este código expira en <strong>1 hora</strong>.</p>
            <p style="color: #555;">Si no solicitaste esto, ignora este correo.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999; text-align: center;">
              RentIPN - Plataforma de vivienda para estudiantes del IPN
            </p>
          </div>
        </body>
        </html>
      `,
    });
    console.log('✅ Correo de recuperación enviado a:', destinatario);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar correo de recuperación:', error.message);
    return false;
  }
};

module.exports = {
  enviarCodigoVerificacion,
  reenviarCodigoVerificacion,
  enviarCorreoContacto,
  enviarCodigoRecuperacion,
};
