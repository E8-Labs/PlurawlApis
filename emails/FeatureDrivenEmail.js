const HtmlTemplateFeatureDriven = `
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
      text-align: left;
    }
    .body ul {
      list-style-type: disc;
      padding-left: 20px;
    }
    .body ul li {
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
    .footer {
      text-align: center;
      background-color: #f4f4f4;
      padding: 10px;
      font-size: 12px;
      color: #aaa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🤖 Too Real for the Group Chat?</div>
    <div class="body">
      <p>Hey {First_Name},</p>
      <ul>
        <li>Some thoughts are just too real to say out loud. That’s why we’re here.</li>
        <li>When you need a judgment-free space to talk it out—anytime, anywhere—Plurawl is ready to listen.</li>
        <li>No filters. No pressure. Just you, your thoughts, and a place to process them.</li>
        <li>Say what’s on your mind. We’re here 24/7.</li>
      </ul>
      <p>👉 <a href="{CTA_Link}" class="hyperlink">Start Here</a></p>
    </div>
    <div class="footer">
      You’re not alone.<br>
      – The Plurawl Team
    </div>
  </div>
</body>
</html>`;

export function generateFeatureDrivenEmail(First_Name, CTA_Link) {
  let emailTemplate = HtmlTemplateFeatureDriven;

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
    subject: "🤖 Too Real for the Group Chat? We Got You.",
  };
}
