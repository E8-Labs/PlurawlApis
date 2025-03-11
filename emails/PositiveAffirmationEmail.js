const HtmlTemplateMainCharacter = `
<!DOCTYPE html>
<html>
<head>
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
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      text-align: center;
    }
    .header {
      background-color: #D44740;
      color: #fff;
      text-align: center;
      padding: 20px;
      font-size: 24px;
      font-weight: bold;
    }
    .body {
      padding: 20px;
      color: #555;
      font-size: 14px;
      line-height: 1.6;
    }
    .body p {
      margin: 10px 0;
    }
    .bold {
      font-weight: bold;
    }
    .hyperlink {
      color: #007BFF;
      font-weight: bold;
      text-decoration: none;
    }
    .hyperlink:hover {
      text-decoration: underline;
    }
    .cta {
      display: block;
      margin: 20px auto;
      padding: 12px 24px;
      width: 50%;
      background-color: #D44740;
      color: #fff;
      text-decoration: none;
      border-radius: 12px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }
    .cta:hover {
      background-color: #94302B;
    }
    .ctaText {
      color: #FFFFFF;
    }
    .footer {
      text-align: center;
      background-color: #f4f4f4;
      padding: 10px;
      font-size: 12px;
      color: #aaa;
    }
    .image-container {
      text-align: center;
      margin: 20px 0;
    }
    .image-container img {
      width: 100%;
      max-width: 500px;
      height: auto;
      display: block;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">💖 Main Character Energy</div>
    <div class="image-container">
      <img src="https://plurawl-storage.s3.us-east-2.amazonaws.com/VipAccess.png" alt="Main Character Energy">
    </div>
    <div class="body">
      <p>Hey {First_Name},</p>
      <p>You are not a side story in your own life. Drop one thing you love about yourself today.</p>
      <p>It’s time to embrace your own narrative and appreciate the amazing person you are.</p>
      <p>Take a moment and celebrate yourself. We’re here with you every step of the way.</p>
      <a href="{CTA_Link}" class="cta"><p class="ctaText">Share One Thing You Love</p></a>
    </div>
    <div class="footer">
      Keep shining.<br>
      – The Plurawl Team
    </div>
  </div>
</body>
</html>`;

//Not being used.
export function generatePositiveAffirmationWeek1Email(
  First_Name,
  CTA_Link = ""
) {
  let emailTemplate = HtmlTemplateMainCharacter;

  let parts = First_Name.split(" ");
  let firstName = First_Name;
  if (parts.length > 0) {
    firstName = parts[0];
  }

  // Replace placeholders with actual values
  const variables = {
    First_Name: firstName,
    CTA_Link,
  };

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{${key}}`, "g");
    emailTemplate = emailTemplate.replace(placeholder, value);
  }

  return {
    html: emailTemplate,
    subject: "💖 Main Character Energy",
  };
}
