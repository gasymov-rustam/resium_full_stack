import { log } from "./../../../helpers/logger";
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST ?? "";
const SMTP_PORT = process.env.SMTP_PORT ?? 587;
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD ?? "";
const API_URL = process.env.API_URL ?? "";

export const sendActivationMail = async (to: string, link: string) => {
  const SMTP_HOST = process.env.SMTP_HOST ?? "";
  const SMTP_PORT = process.env.SMTP_PORT ?? 465;
  const SMTP_USER = process.env.SMTP_USER ?? "";
  const SMTP_PASSWORD = process.env.SMTP_PASSWORD ?? "";
  const API_URL = process.env.API_URL ?? "";

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: +SMTP_PORT,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
      privateKey: "KMIJTWM5TVOql2PV",
    },
  });

  log.info(SMTP_USER);

  const mailOptions = {
    from: SMTP_USER,
    to,
    subject: `Activation an account ${API_URL}`,
    text: "",
    html: `
            <div>
              <h1>Для активации перейдите по ссылке</h1>
              <a href="${link}">${link}</a>
            </div>
          `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  console.log(info);
  return info;
  // await transporter.sendMail({
  //   from: SMTP_USER,
  //   to,
  //   subject: `Activation an account ${API_URL}`,
  //   text: "",
  //   html: `
  //           <div>
  //             <h1>Для активации перейдите по ссылке</h1>
  //             <a href="${link}">${link}</a>
  //           </div>
  //         `,
  // });
};
