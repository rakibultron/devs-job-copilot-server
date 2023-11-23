const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
  },
});
console.log(process.env.GMAIL_PASSWORD);

async function mailGun(job) {
  const {
    jobTitle,
    company,
    location,
    applicants,
    strength,
    jobtype,
    jobLink,
  } = job;
  // send mail with defined transport object

  const maillist = [
    "mdrakibul.dev@gmail.com",
    "zahidul.haque767@gmail.com",
    "yamin.arafat01@gmail.com",
    "pkshohag240@gmail.com",
  ];

  maillist.forEach(async function (to, i, array) {
    var msg = {
      from: '"Devs Jobs Copilot 👻" <foo@example.com>',
      subject: "Hey dev we found a new job. ✔",
      text: "Lets checkout?",
      html: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Job Opportunity</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      h4 {
        color: #333;
      }

      h6 {
        color: #666;
      }

      button {
        background-color: #007bff;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        text-decoration: none;
        cursor: pointer;
      }

      a {
        text-decoration: none;
      }

      button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h4>${jobTitle}</h4>
      <h6>${company}</h6>
      <h6>${location}</h6>
      <h6>${applicants}</h6>
      <h6>${strength}</h6>
      <h6>${jobtype}</h6>
      <a href="${jobLink}">
        <button>View Job</button>
      </a>
    </div>
  </body>
</html>`,
    };
    msg.to = to;

    transporter.sendMail(msg, function (err) {
      if (err) {
        console.log("message not sent", err);
      }
    });
  });
}

module.exports = mailGun;
