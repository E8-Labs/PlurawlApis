import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.AppPassword,
  },
  maxConnections: 5,
  maxMessages: 100,
});

export async function SendEmail(to, subject, html) {
  const mailOptions = {
    from: process.env.email,
    to,
    subject,
    html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    // console.log("Mail sent result:", result);
    return { status: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Exception email:", error);
    return { status: false, message: "An error occurred" };
  }
}
