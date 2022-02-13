import nodemailer from "nodemailer";

export const sendEmail = (to: string, subject: string, msg: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mernproject10@gmail.com",
      pass: "Mern123!",
    },
  });

  const mailOptions = {
    from: "mernproject10@gmail.com",
    to: `${to}`,
    subject: `${subject}`,
    text: `${msg}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent:" + info.response);
    }
  });
};
