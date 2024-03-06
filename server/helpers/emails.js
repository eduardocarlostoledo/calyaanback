// import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
import { sendWhatsappfn } from "../controllers/message.js";
import path from "path";

const __dirname = path.resolve();

// ENVIAR UN EMAIL DE CONFIRMACION DE CUENTA DEL REGISTRO
const emailRegistro = async (data) => {
  const { nombre, email, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // informacion para el email

  const info = await transport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirma tu cuenta de Calyaan",
    text: "Calyaan",
    attachments: [
      {
        filename: "Logo-Calyaan.webp",
        path: __dirname + "/server/public/images/Logo-Calyaan.webp",
        cid: "logo",
      },
    ],
    html: `
    <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  
  <head>
    <title>Bienvenida</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
    <meta name="format-detection" content="telephone=no" />
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
    <!--<![endif]-->
    <style type="text/css">
      body {
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
        -webkit-font-smoothing: antialiased !important;
      }
  
      img {
        border: 0 !important;
        outline: none !important;
      }
  
      p {
        Margin: 0px !important;
        Padding: 0px !important;
      }
  
      table {
        border-collapse: collapse;
        mso-table-lspace: 0px;
        mso-table-rspace: 0px;
      }
  
      td,
      a,
      span {
        border-collapse: collapse;
        mso-line-height-rule: exactly;
      }
  
      .ExternalClass * {
        line-height: 100%;
      }
  
      span.MsoHyperlink {
        mso-style-priority: 99;
        color: inherit;
      }
  
      span.MsoHyperlinkFollowed {
        mso-style-priority: 99;
        color: inherit;
      }
    </style>
    <style media="only screen and (min-width:481px) and (max-width:599px)" type="text/css">
      @media only screen and (min-width:481px) and (max-width:599px) {
        table[class=em_main_table] {
          width: 100% !important;
        }
  
        table[class=em_wrapper] {
          width: 100% !important;
        }
  
        td[class=em_hide],
        br[class=em_hide] {
          display: none !important;
        }
  
        img[class=em_full_img] {
          width: 100% !important;
          height: auto !important;
        }
  
        td[class=em_align_cent] {
          text-align: center !important;
        }
  
        td[class=em_aside] {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
  
        td[class=em_height] {
          height: 20px !important;
        }
  
        td[class=em_font] {
          font-size: 14px !important;
        }
  
        td[class=em_align_cent1] {
          text-align: center !important;
          padding-bottom: 10px !important;
        }
      }
    </style>
    <style media="only screen and (max-width:480px)" type="text/css">
      @media only screen and (max-width:480px) {
        table[class=em_main_table] {
          width: 100% !important;
        }
  
        table[class=em_wrapper] {
          width: 100% !important;
        }
  
        td[class=em_hide],
        br[class=em_hide],
        span[class=em_hide] {
          display: none !important;
        }
  
        img[class=em_full_img] {
          width: 100% !important;
          height: auto !important;
        }
  
        td[class=em_align_cent] {
          text-align: center !important;
        }
  
        td[class=em_align_cent1] {
          text-align: center !important;
          padding-bottom: 10px !important;
        }
  
        td[class=em_height] {
          height: 20px !important;
        }
  
        td[class=em_aside] {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
  
        td[class=em_font] {
          font-size: 14px !important;
          line-height: 28px !important;
        }
  
        span[class=em_br] {
          display: block !important;
        }
      }
    </style>
  </head>
  
  <body style="margin:0px; padding:0px;" bgcolor="#ffffff">
    <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
  
      <!-- === //PRE HEADER SECTION=== -->
      <!-- === BODY SECTION=== -->
      <tr>
        <td align="center" valign="top" bgcolor="#ffffff">
          <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="em_main_table"
            style="table-layout:fixed;">
            <!-- === LOGO SECTION === -->
            <tr>
              <td height="40" class="em_height">&nbsp;</td>
            </tr>
            <tr>
              <td align="center"><a href="#" target="_blank" style="text-decoration:none;"><img
                    src="cid:logo" width="230" height="115"
                    style="display:block;font-family: Arial, sans-serif; font-size:15px; line-height:18px; color:#30373b;  font-weight:bold;"
                    border="0" alt="Logo Calyaan" /></a></td>
            </tr>
            <tr>
              <td height="30" class="em_height">&nbsp;</td>
            </tr>
            <!-- === //LOGO SECTION === -->
            <!-- === NEVIGATION SECTION === -->
          
            <tr>
              <td height="14" style="font-size:1px; line-height:1px;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center"
                style="font-family:'Open Sans', Arial, sans-serif; font-size:15px; line-height:18px; color:#30373b; text-transform:uppercase; font-weight:bold;"
                class="em_font">
                <a href="#" target="_blank" style="text-decoration:none; color:#30373b;">Centro de estética</a>
                &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp; <a href="#" target="_blank"
                  style="text-decoration:none; color:#30373b;">Tienda</a>
                &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp; <a href="#" target="_blank"
                  style="text-decoration:none; color:#30373b;">Blog</a> &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="#" target="_blank" style="text-decoration:none; color:#30373b;">Nosotros</a>
              </td>
            </tr>
            <tr>
              <td height="14" style="font-size:1px; line-height:1px;">&nbsp;</td>
            </tr>
            <tr>
              <td height="1" bgcolor="#eda598" style="font-size:0px; line-height:0px;"><img
                  src="https://www.sendwithus.com/assets/img/emailmonks/images/spacer.gif" width="2" height="2"
                  style="display:block;" border="0" alt="" /></td>
            </tr>
            <!-- === //NEVIGATION SECTION === -->
            <!-- === IMG WITH TEXT AND COUPEN CODE SECTION === -->
            <tr>
              <td valign="top" class="em_aside">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
  
                  <tr>
                    <td height="35" class="em_height">&nbsp;</td>
                  </tr>
                  <tr>
                    <td align="center"
                      style="font-family:'Open Sans', Arial, sans-serif; font-size:20px; font-weight:bold; line-height:18px; color:#30373b;">
                      Bienvenid@ ${nombre}</td>
                  </tr>
                  <tr>
                    <td height="15" class="em_height">&nbsp;</td>
                  </tr>
                  <tr>
                    <td align="center"
                      style="font-family:'Open Sans', Arial, sans-serif; font-size:20px; font-weight:bold; line-height:28px; color:#30373b;">
                      Activa tu cuenta de Calyaan y disfruta de todo lo que tenemos para ti</td>
                  </tr>
                  <tr>
                    <td height="22" style="font-size:1px; line-height:1px;">&nbsp;</td>
                  </tr>
  
                  <tr>
                    <td align="center"
                      style="font-family:'Open Sans', Arial, sans-serif; font-size:15px; line-height:22px; color:#999999;">
                      Para poder acceder a Calyaan y disfrutar de todas las ventajas que te ofrece, debes confirmar tu
                      email haciendo click en el botón.
                    </td>
                  </tr>
  
                  <tr>
                    <td height="20" style="font-size:1px; line-height:1px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td valign="top" align="center">
                      <table width="210" border="0" cellspacing="0" cellpadding="0" align="center">
                        <tr>
                          <td valign="middle" align="center" height="45" bgcolor="#eda598"
                            style="font-family:'Open Sans', Arial, sans-serif; font-size:17px; font-weight:bold; color:#ffffff;">
                        
                            <a href="${process.env.FRONTEND_URL}/registro/confirmar/${token}"  target="_blank"
                                  style="color:#FFFFFF; text-decoration:underline;">Confirmar tu email</a>
                           
                            </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td height="12" style="font-size:1px; line-height:1px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td align="center"
                      style="font-family:'Open Sans', Arial, sans-serif; font-size:18px; font-weight:bold; line-height:20px; color:#eda598;">
                      ¡Gracias por registrarte a Calyaan!</td>
                  </tr>

                    <td height="10" class="em_height">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <tr>
        <td align="center" valign="top" bgcolor="#30373b" class="em_aside">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" class="em_main_table"
            style="table-layout:fixed;">
            <tr>
              <tr>
                   <td height="20" class="em_height">&nbsp;</td>
              </tr>
              <td align="center"
                style="font-family:'Open Sans', Arial, sans-serif; font-size:12px; line-height:18px; color:#848789; text-transform:uppercase;">
                <span style="text-decoration:underline;"><a href="https://calyaan.com/privacidad/" target="_blank"
                    style="text-decoration:underline; color:#848789;">Privacidad</a></span>
                &nbsp;&nbsp;|&nbsp;&nbsp; <span style="text-decoration:underline;"><a
                    href="https://calyaan.com/habeas-data/" target="_blank"
                    style="text-decoration:underline; color:#848789;">Habeas-data</a></span><span class="em_hide">
                  &nbsp;&nbsp;|&nbsp;&nbsp; </span><span class="em_br"></span><span style="text-decoration:underline;"><a
                    href="https://calyaan.com/categoria-producto/centro-belleza-bogota/" target="_blank"
                    style="text-decoration:underline; color:#848789;">Tienda</a></span>
              </td>
            </tr>
  
            <tr>
              <td align="center"
                style="font-family:'Open Sans', Arial, sans-serif; font-size:12px; line-height:18px; color:#848789;text-transform:uppercase;">
                Copyright © 2023 Calyaan
              </td>
            </tr>

            <tr>
               <td height="20" class="em_height">&nbsp;</td>
           </tr>

            <tr>
          </table>
        </td>
      </tr>
      </tr>
      <!-- === //FOOTER SECTION === -->
    </table>

  </body>
  
  </html>  
    `,
  });
};
// ENVIAR UN EMAIL PARA HABILITAR LA CREACION DE UNA NUEVA CONTRASEÑA
const emailOlvidePassword = async (data) => {

  try {    

  const { nombre, email, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },    
  });

  // informacion para el email

  const info = await transport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Restablece tu contraseña",
    text: "calyaan",
    attachments: [
      {
        filename: "Logo-Calyaan.webp",
        path: __dirname + "/server/public/images/Logo-Calyaan.webp",
        cid: "logo",
      },
    ],
    html: `
    <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  
  <head>
    <title>Bienvenida</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
    <meta name="format-detection" content="telephone=no" />
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
    <!--<![endif]-->
    <style type="text/css">
      body {
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
        -webkit-font-smoothing: antialiased !important;
      }
  
      img {
        border: 0 !important;
        outline: none !important;
      }
  
      p {
        Margin: 0px !important;
        Padding: 0px !important;
      }
  
      table {
        border-collapse: collapse;
        mso-table-lspace: 0px;
        mso-table-rspace: 0px;
      }
  
      td,
      a,
      span {
        border-collapse: collapse;
        mso-line-height-rule: exactly;
      }
  
      .ExternalClass * {
        line-height: 100%;
      }
  
      span.MsoHyperlink {
        mso-style-priority: 99;
        color: inherit;
      }
  
      span.MsoHyperlinkFollowed {
        mso-style-priority: 99;
        color: inherit;
      }
    </style>
    <style media="only screen and (min-width:481px) and (max-width:599px)" type="text/css">
      @media only screen and (min-width:481px) and (max-width:599px) {
        table[class=em_main_table] {
          width: 100% !important;
        }
  
        table[class=em_wrapper] {
          width: 100% !important;
        }
  
        td[class=em_hide],
        br[class=em_hide] {
          display: none !important;
        }
  
        img[class=em_full_img] {
          width: 100% !important;
          height: auto !important;
        }
  
        td[class=em_align_cent] {
          text-align: center !important;
        }
  
        td[class=em_aside] {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
  
        td[class=em_height] {
          height: 20px !important;
        }
  
        td[class=em_font] {
          font-size: 14px !important;
        }
  
        td[class=em_align_cent1] {
          text-align: center !important;
          padding-bottom: 10px !important;
        }
      }
    </style>
    <style media="only screen and (max-width:480px)" type="text/css">
      @media only screen and (max-width:480px) {
        table[class=em_main_table] {
          width: 100% !important;
        }
  
        table[class=em_wrapper] {
          width: 100% !important;
        }
  
        td[class=em_hide],
        br[class=em_hide],
        span[class=em_hide] {
          display: none !important;
        }
  
        img[class=em_full_img] {
          width: 100% !important;
          height: auto !important;
        }
  
        td[class=em_align_cent] {
          text-align: center !important;
        }
  
        td[class=em_align_cent1] {
          text-align: center !important;
          padding-bottom: 10px !important;
        }
  
        td[class=em_height] {
          height: 20px !important;
        }
  
        td[class=em_aside] {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
  
        td[class=em_font] {
          font-size: 14px !important;
          line-height: 28px !important;
        }
  
        span[class=em_br] {
          display: block !important;
        }
      }
    </style>
  </head>
  
  <body style="margin:0px; padding:0px;" bgcolor="#ffffff">
    <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
  
      <!-- === //PRE HEADER SECTION=== -->
      <!-- === BODY SECTION=== -->
      <tr>
        <td align="center" valign="top" bgcolor="#ffffff">
          <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="em_main_table"
            style="table-layout:fixed;">
            <!-- === LOGO SECTION === -->
            <tr>
              <td height="40" class="em_height">&nbsp;</td>
            </tr>
            <tr>
              <td align="center"><a href="#" target="_blank" style="text-decoration:none;"><img
                    src="cid:logo" width="230" height="115"
                    style="display:block;font-family: Arial, sans-serif; font-size:15px; line-height:18px; color:#30373b;  font-weight:bold;"
                    border="0" alt="Logo Calyaan" /></a></td>
            </tr>
            <tr>
              <td height="30" class="em_height">&nbsp;</td>
            </tr>
            <!-- === //LOGO SECTION === -->
            <!-- === NEVIGATION SECTION === -->
          
            <tr>
              <td height="14" style="font-size:1px; line-height:1px;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center"
                style="font-family:'Open Sans', Arial, sans-serif; font-size:15px; line-height:18px; color:#30373b; text-transform:uppercase; font-weight:bold;"
                class="em_font">
                <a href="#" target="_blank" style="text-decoration:none; color:#30373b;">Centro de estética</a>
                &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp; <a href="#" target="_blank"
                  style="text-decoration:none; color:#30373b;">Tienda</a>
                &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp; <a href="#" target="_blank"
                  style="text-decoration:none; color:#30373b;">Blog</a> &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                <a href="#" target="_blank" style="text-decoration:none; color:#30373b;">Nosotros</a>
              </td>
            </tr>
            <tr>
              <td height="14" style="font-size:1px; line-height:1px;">&nbsp;</td>
            </tr>
            <tr>
              <td height="1" bgcolor="#eda598" style="font-size:0px; line-height:0px;"><img
                  src="https://www.sendwithus.com/assets/img/emailmonks/images/spacer.gif" width="2" height="2"
                  style="display:block;" border="0" alt="" /></td>
            </tr>
            <!-- === //NEVIGATION SECTION === -->
            <!-- === IMG WITH TEXT AND COUPEN CODE SECTION === -->
            <tr>
              <td valign="top" class="em_aside">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
  
                  <tr>
                    <td height="35" class="em_height">&nbsp;</td>
                  </tr>
                  <tr>
                    <td align="center"
                      style="font-family:'Open Sans', Arial, sans-serif; font-size:20px; font-weight:bold; line-height:18px; color:#30373b;">
                      Hola,${nombre}</td>
                  </tr>
                  <tr>
                    <td height="15" class="em_height">&nbsp;</td>
                  </tr>
                  <tr>
                    <td align="center"
                      style="font-family:'Open Sans', Arial, sans-serif; font-size:20px; font-weight:bold; line-height:28px; color:#30373b;">
                      Has realizado una solicitud de cambio de contraseña</td>
                  </tr>
                  <tr>
                    <td height="22" style="font-size:1px; line-height:1px;">&nbsp;</td>
                  </tr>
  
                  <tr>
                    <td align="center"
                      style="font-family:'Open Sans', Arial, sans-serif; font-size:15px; line-height:22px; color:#999999;">
                      Para activar una nueva contraseña debes hacer click en el botón
                    </td>
                  </tr>
  
                  <tr>
                    <td height="20" style="font-size:1px; line-height:1px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td valign="top" align="center">
                      <table width="210" border="0" cellspacing="0" cellpadding="0" align="center">
                        <tr>
                          <td valign="middle" align="center" height="45" bgcolor="#eda598"
                            style="font-family:'Open Sans', Arial, sans-serif; font-size:17px; font-weight:bold; color:#ffffff;">
                        
                            <a href="${process.env.FRONTEND_URL}/nueva-password/${token}"  target="_blank"
                                  style="color:#FFFFFF; text-decoration:underline;">Nueva contraseña</a>
                           
                            </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td height="12" style="font-size:1px; line-height:1px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td align="center"
                      style="font-family:'Open Sans', Arial, sans-serif; font-size:18px; font-weight:bold; line-height:20px; color:#eda598;">
                      ¡Gracias por registrarte a Calyaan!</td>
                  </tr>

                    <td height="10" class="em_height">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <tr>
        <td align="center" valign="top" bgcolor="#30373b" class="em_aside">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" class="em_main_table"
            style="table-layout:fixed;">
            <tr>
              <tr>
                   <td height="20" class="em_height">&nbsp;</td>
              </tr>
              <td align="center"
                style="font-family:'Open Sans', Arial, sans-serif; font-size:12px; line-height:18px; color:#848789; text-transform:uppercase;">
                <span style="text-decoration:underline;"><a href="https://calyaan.com/privacidad/" target="_blank"
                    style="text-decoration:underline; color:#848789;">Privacidad</a></span>
                &nbsp;&nbsp;|&nbsp;&nbsp; <span style="text-decoration:underline;"><a
                    href="https://calyaan.com/habeas-data/" target="_blank"
                    style="text-decoration:underline; color:#848789;">Habeas-data</a></span><span class="em_hide">
                  &nbsp;&nbsp;|&nbsp;&nbsp; </span><span class="em_br"></span><span style="text-decoration:underline;"><a
                    href="https://calyaan.com/categoria-producto/centro-belleza-bogota/" target="_blank"
                    style="text-decoration:underline; color:#848789;">Tienda</a></span>
              </td>
            </tr>
  
            <tr>
              <td align="center"
                style="font-family:'Open Sans', Arial, sans-serif; font-size:12px; line-height:18px; color:#848789;text-transform:uppercase;">
                Copyright © 2023 Calyaan
              </td>
            </tr>

            <tr>
               <td height="20" class="em_height">&nbsp;</td>
           </tr>

            <tr>
          </table>
        </td>
      </tr>
      </tr>
      <!-- === //FOOTER SECTION === -->
    </table>

  </body>
  
  </html>  
    `,
  });
} catch (error) {
  console.log(error);
}
};

///////////////////////////////////////////////NOTIFICACIONES DE COMPRAS Y ORDENES DE TRABAJO/////////////////////

// email Compra
const emailCompra = async (data) => {

  try {    
  
  const { 
    order_id,
    cliente_id,    
        cliente_email,
        cliente_nombre,
        cliente_apellido,
        cliente_cedula,
        cliente_telefono,    
        profesional_id,
        profesional_email,
        profesional_nombre,
        profesional_apellido,
        profesional_telefono,
        servicio,
        cantidad,
        precio,
        dia_servicio,
        hora_servicio,
        direccion_Servicio,
        adicional_direccion_Servicio,
        ciudad_Servicio,
        localidad_Servicio,
        telefono_Servicio,
        estadoPago,
        payment_id,      
        payment_type,
        merchant_order_id } = data;
  //Se modifica estado pago para el envio de notificacion al cliente
  const pagoServicio = estadoPago === "approved" ? "Aprobado" : estadoPago === "pending" ? "Pendiente" : "Rechazado";


  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailHTML = `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Orden de Servicio</title>
    <style>
          body {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 16px;
            line-height: 1.6;
            color: #444444;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo img {
            max-width: 150px;
          }
          .message {
            background-color: #f8f8f8;
            border: 1px solid #dddddd;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .message p {
            margin-bottom: 10px;
          }
          .signature {
            text-align: right;
          }
          .signature p {
            margin-bottom: 5px;
          }
        </style>
  </head>
  <body>
<div class="container">
<div class="logo">
            <img src="https://calyaan.b-cdn.net/wp-content/uploads/2022/01/Logo-Calyaan2.png" alt="Logo de la empresa">
          </div>
  <p>Estimad@ ${cliente_nombre} ${cliente_apellido},</p>
  <p>Nos complace informarle que su solicitud de servicio ha sido procesada con éxito. Usted ha contratado nuestro servicio de ${servicio} para su hogar en la dirección: ${direccion_Servicio}, cuyos datos adicionales: ${adicional_direccion_Servicio}, ubicada en la localidad de ${localidad_Servicio}, ciudad de ${ciudad_Servicio}.</p>
  <p>Su solicitud ha sido asignada a nuestr@ profesional: ${profesional_nombre}, quien estará disponible para brindarle el servicio el día: ${dia_servicio} a las: ${hora_servicio}.</p>
  <p>Le recordamos que el costo del servicio es de $${precio} y que el estado de su pago es: ${pagoServicio} </p>
  <p>Puede coordinar los detalles de su reserva en el siguiente Chat: https://calyaan.netlify.app/resumen/${order_id}</p>
  <p>Si tiene alguna pregunta o inquietud, no dude en ponerse en contacto con nuestro equipo de soporte al cliente, siempre estamos dispuestos a ayudarle.</p>
  <p>Le agradecemos por confiar en nosotros y esperamos poder brindarle un excelente servicio.</p>
  <div class="signature">
    <p>Cordialmente,</p>
    <p>El equipo de servicio al cliente de Calyann</p>
  </div>
</div>
</body>
  </html> `;

  const args = {
    number: cliente_telefono,
    message: `Estimad@ ${cliente_nombre} ${cliente_apellido}. Nos complace informarle que su solicitud de servicio ha sido procesada con éxito. Usted ha contratado nuestro servicio de ${servicio} para su hogar en la dirección: ${direccion_Servicio}, cuyos datos adicionales: ${adicional_direccion_Servicio}, ubicada en la localidad de ${localidad_Servicio}, ciudad de ${ciudad_Servicio}. Su solicitud ha sido asignada a nuestr@ profesional: ${profesional_nombre}, quien estará disponible para brindarle el servicio el día: ${dia_servicio} a las: ${hora_servicio}. Le recordamos que el costo del servicio es de $${precio} y que el estado de su pago es: ${pagoServicio}. Si tiene alguna pregunta o inquietud, no dude en ponerse en contacto con nuestro equipo de soporte al cliente, siempre estamos dispuestos a ayudarle. Le agradecemos por confiar en nosotros y esperamos poder brindarle un excelente servicio. Cordialmente, El equipo de servicio al cliente de Calyann.`
  };
  if (cliente_telefono) await sendWhatsappfn(args);  

  const info = await transport.sendMail({
    from: process.env.EMAIL_USER,
    to: cliente_email,
    subject: "Información de Servicio",
    text: "calyaan",    
    html: emailHTML,
  });

} catch (error) {
  console.log(error);
}
};

//notificacion a profesional
const emailProfesional = async (data) => {

  try {
    
  
  const {
    order_id,
    cliente_id,    
        cliente_email,
        cliente_nombre,
        cliente_apellido,
        cliente_cedula,
        cliente_telefono,    
        profesional_id,
        profesional_email,
        profesional_nombre,
        profesional_apellido,
        profesional_telefono,
        servicio,
        cantidad,
        precio,
        dia_servicio,
        hora_servicio,
        direccion_Servicio,
        adicional_direccion_Servicio,
        ciudad_Servicio,
        localidad_Servicio,
        telefono_Servicio,
        estadoPago,
        payment_id,      
        payment_type,
        merchant_order_id
  } = data
  //Se modifica estado pago para el envio de notificacion al profesional
  const pagoServicio = estadoPago === "approved" ? "Aprobado" : estadoPago === "pending" ? "Pendiente" : "Rechazado";

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //cuerpo email profesional
  const emailHTML = `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Orden de trabajo</title>
    <style>
      body {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 16px;
        line-height: 1.6;
        color: #444444;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 150px;
      }
      .message {
        background-color: #f8f8f8;
        border: 1px solid #dddddd;
        border-radius: 5px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .message p {
        margin-bottom: 10px;
      }
      .signature {
        text-align: right;
      }
      .signature p {
        margin-bottom: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="https://calyaan.b-cdn.net/wp-content/uploads/2022/01/Logo-Calyaan2.png" alt="Logo de la empresa">
      </div>
      <div class="message">
        <p>Estimado/a ${profesional_nombre}: </p>
        <p>Le informamos que hemos procesado una solicitud de servicio de <strong> ${servicio} </strong> para el cliente: ${cliente_nombre} ${cliente_apellido}, cédula: ${cliente_cedula}. La prestación se llevará a cabo el día: ${dia_servicio} a las: ${hora_servicio}, ubicado en: ${direccion_Servicio}, datos adicionales: ${adicional_direccion_Servicio}, en la localidad de ${localidad_Servicio}, ciudad de ${ciudad_Servicio}.</p>
        <p>Le recordamos que el estado del pago del servicio es: ${pagoServicio}.</p>
        <p>Puede coordinar los detalles de su reserva en el siguiente Chat: https://calyaan.netlify.app/resumen-profesional/${order_id}</p>
        <p>Si tiene alguna pregunta o inquietud, no dude en ponerse en contacto con el equipo de soporte. </p>
        
      </div>
      <div class="signature">
        <p>Cordialmente,</p>
        <p>El equipo de Calyann</p>
      </div>
    </div>
  </body>
  </html>

`
const args = {
  number: profesional_telefono,
  message: `Estimado/a ${profesional_nombre}. Le informamos que hemos procesado una solicitud de servicio de: ${servicio} para el cliente: ${cliente_nombre} ${cliente_apellido}, cédula: ${cliente_cedula}. La prestación se llevará a cabo el día: ${dia_servicio} a las: ${hora_servicio}, ubicado en: ${direccion_Servicio}, datos adicionales: ${adicional_direccion_Servicio}, en la localidad de ${localidad_Servicio}, ciudad de ${ciudad_Servicio}. Le recordamos que el estado del pago del servicio es: ${pagoServicio}. Si tiene alguna pregunta o inquietud, no dude en ponerse en contacto con el equipo de soporte. Cordialmente, El equipo de Calyann.`
}

if (profesional_telefono) await sendWhatsappfn(args);

  const info = await transport.sendMail({
    from: process.env.EMAIL_USER,
    to: profesional_email,
    subject: "Orden de Servicio",
    text: "Calyaan",    
    html: emailHTML,
  });
} catch (error) {
  console.log(error);
}
};

//notificacion de cancelacion de servicio a profesional emailCancelacionProfesional
const emailCancelacionProfesional = async (data) => {

  try {
    
  
  const {
    _id,
    cliente_nombre,
    cliente_apellido,
    liberar_hora_servicio,
    liberar_dia_servicio,
    liberar_profesional_id,
    liberar_profesional_email,
    liberar_profesional_telefono
  } = data
  //Se modifica estado pago para el envio de notificacion al profesional
  

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //cuerpo email profesional
  const emailHTML = `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Orden de trabajo</title>
    <style>
      body {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 16px;
        line-height: 1.6;
        color: #444444;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 150px;
      }
      .message {
        background-color: #f8f8f8;
        border: 1px solid #dddddd;
        border-radius: 5px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .message p {
        margin-bottom: 10px;
      }
      .signature {
        text-align: right;
      }
      .signature p {
        margin-bottom: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="https://calyaan.b-cdn.net/wp-content/uploads/2022/01/Logo-Calyaan2.png" alt="Logo de la empresa">
      </div>
      <div class="message">

        <p>Estimado/a: </p>
        <p>Le informamos que hemos procesado una solicitud de reprogramacion de servicio de la orden ${_id} del cliente ${cliente_nombre} ${cliente_apellido} que estaba agendada para el día: ${liberar_dia_servicio} a las: ${liberar_hora_servicio}. </p> 
        <p>Si tiene alguna pregunta o inquietud, no dude en ponerse en contacto con el equipo de soporte facilitando el numero de orden. </p>
        
      </div>
      <div class="signature">
        <p>Cordialmente,</p>
        <p>El equipo de Calyann</p>
      </div>
    </div>
  </body>
  </html>
`

const args = {
  number: liberar_profesional_telefono,
  message: `Le informamos que hemos procesado una solicitud de reprogramacion de servicio de la orden ${_id} del cliente ${cliente_nombre} ${cliente_apellido} que estaba agendada para el día: ${liberar_dia_servicio} a las: ${liberar_hora_servicio}. Si tiene alguna pregunta o inquietud, no dude en ponerse en contacto con el equipo de soporte facilitando el numero de orden.`
}

if (liberar_profesional_telefono) await sendWhatsappfn(args);

  const info = await transport.sendMail({
    from: process.env.EMAIL_USER,
    to: liberar_profesional_email,
    subject: "Reprogramacion de Servicio",
    text: "Calyaan",    
    html: emailHTML,
  });
} catch (error) {
  console.log(error);
}
};

const emailNotificacionCliente = async (id, emailCliente, cliente_telefono) => {
  console.log(id, emailCliente, cliente_telefono)
  try { 
  
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //cuerpo email 
  const emailHTML = `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Orden de trabajo</title>
    <style>
      body {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 16px;
        line-height: 1.6;
        color: #444444;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 150px;
      }
      .message {
        background-color: #f8f8f8;
        border: 1px solid #dddddd;
        border-radius: 5px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .message p {
        margin-bottom: 10px;
      }
      .signature {
        text-align: right;
      }
      .signature p {
        margin-bottom: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="https://calyaan.b-cdn.net/wp-content/uploads/2022/01/Logo-Calyaan2.png" alt="Logo de la empresa">
      </div>
      <div class="message">
        <p>Estimado/a: </p>
        <p>Tienes un mensaje de parte de tu Esteticista</p>
        <a href="${process.env.FRONT}/resumen/${id}" style="text-decoration: none; background-color: #008CBA; color: #ffffff; padding: 10px 20px; border-radius: 5px; display: inline-block;">
        Accede al siguiente Chat en línea y coordina los detalles de tu reserva
    </a>
      </div>
      <div class="signature">
        <p>Cordialmente,</p>
        <p>El equipo de Calyann</p>
      </div>
    </div>
</body>

  </html>
`
const info = await transport.sendMail({
  from: process.env.EMAIL_USER,
  to: emailCliente,
  subject: "Tienes un Mensaje de tu Esteticista",
  text: "calyaan",    
  html: emailHTML,
});

const args = {
  number: cliente_telefono,
  message: `Tu esteticista desea comunicarse contigo. Inicia sesión en la plataforma https://calyaan.netlify.app y coordina los detalles de tu reservación en el chat https://calyaan.netlify.app/resumen/${id}`
};
if (cliente_telefono) await sendWhatsappfn(args);  


} catch (error) {
  console.log(error);
}
};

const emailNotificacionProfesional = async (id, emailProfesional, profesional_telefono) => {
  try {  
  
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //cuerpo email 
  const emailHTML = `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Orden de trabajo</title>
    <style>
      body {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 16px;
        line-height: 1.6;
        color: #444444;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 150px;
      }
      .message {
        background-color: #f8f8f8;
        border: 1px solid #dddddd;
        border-radius: 5px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .message p {
        margin-bottom: 10px;
      }
      .signature {
        text-align: right;
      }
      .signature p {
        margin-bottom: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="https://calyaan.b-cdn.net/wp-content/uploads/2022/01/Logo-Calyaan2.png" alt="Logo de la empresa">
      </div>
      <div class="message">
        <p>Estimado/a: </p>
        <p>Tienes un mensaje de parte de tu Paciente</p>
        <a href="${process.env.FRONT}/resumen-profesional/${id}" style="text-decoration: none; background-color: #008CBA; color: #ffffff; padding: 10px 20px; border-radius: 5px; display: inline-block;">
        Accede al siguiente Chat en línea y coordina los detalles de tu reserva
    </a>
      </div>
      <div class="signature">
        <p>Cordialmente,</p>
        <p>El equipo de Calyann</p>
      </div>
    </div>
  </body>
  </html>
`
const info = await transport.sendMail({
  from: process.env.EMAIL_USER,
  to: emailProfesional,
  subject: "Tienes un Mensaje de tu Paciente",
  text: "calyaan",    
  html: emailHTML,
});

const args = {
  number: profesional_telefono,
  message: `Tu cliente desea comunicarse contigo. Inicia sesión en la plataforma https://calyaan.netlify.app y coordina los detalles de tu reservación en el chat https://calyaan.netlify.app/resumen-profesional/${id}`
};
if (profesional_telefono) await sendWhatsappfn(args);  

} catch (error) {
  console.log(error);
}
};


const emailRecompra = async (email) => {

  try {     


  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailHTML = `<!DOCTYPE html>
  <html lang="es">
  
  <head>
      <meta charset="UTF-8">
      <title>¡Te Extrañamos en Calyaan!</title>
  </head>
  
  <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f5f5f5; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center;">
              <img src="https://calyaan.b-cdn.net/wp-content/uploads/2022/01/Logo-Calyaan2.png" alt="Logo de la empresa" style="max-width: 150px;">
          </div>
          <div style="margin-bottom: 20px; text-align: center;">
              <p>¡Te extrañamos en Calyaan!</p>
              <p>Tenemos una propuesta especial para hacerte. No querrás perderte nuestras ofertas exclusivas.</p>
              <p>Visita nuestro sitio web o contáctanos para obtener más detalles.</p>
          </div>
          <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px; text-align: center;">
          <a href="https://calyyaan.funnelish.com/masajes-reductores" style="display: inline-block; padding: 10px 20px; margin: 2px auto; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; text-decoration: none;">Explorar Ofertas</a>
          <a href="http://wa.me/573242118509" style="display: inline-block; padding: 10px 20px; margin: 2px auto; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; text-decoration: none;">Chatea con Nosotros</a>
      </div>
      
      </div>
  </body>
  
  </html>
  `;

  const info = await transport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "En Calyaan te extrañamos! Tenemos un propuesta especial para ti!",
    text: "calyaan",    
    html: emailHTML,
  });

} catch (error) {
  console.log(error);
}
};


export { emailRegistro, emailOlvidePassword, emailCompra, emailProfesional, emailCancelacionProfesional, emailNotificacionCliente, emailNotificacionProfesional, emailRecompra };
