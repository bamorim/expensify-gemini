import nodemailer from "nodemailer";
import { env } from "~/env";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport(env.MAIL_SERVER);

async function sendEmail({ to, subject, html }: EmailParams) {
  await transporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    html,
  });
}

interface InvitationEmailParams {
  email: string;
  invitationLink: string;
}

export async function sendInvitationEmail({ email, invitationLink }: InvitationEmailParams) {
  const subject = "You have been invited to join an organization on Expensify";
  const html = `<p>Click the link below to accept the invitation:</p><a href="${invitationLink}">${invitationLink}</a>`;

  await sendEmail({ to: email, subject, html });
}
