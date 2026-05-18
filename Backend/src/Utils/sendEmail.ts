import nodemailer from "nodemailer";
import path from "path";
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"RentMyBike" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "logo.jpg",
        path: path.join(process.cwd(), "uploads", "logo", "logo.jpeg"),
        cid: "rentmybikelogo"
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};
