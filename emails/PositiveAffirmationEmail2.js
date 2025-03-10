const HtmlTemplatePositiveAffirmation = `
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
    <div class="header">🚀 You Can Level Up.</div>
    <div class="body">
      <p>Hey {First_Name},</p>
      <p>Every step forward counts. Another week down, another win under your belt. Take a moment to reflect on how far you’ve come.</p>
      <p>Growth isn’t always loud—it’s in the small victories, the lessons learned, and the resilience you build along the way.</p>
      <p>Keep leveling up. We’re here with you.</p>
      <p>👉 <a href="{CTA_Link}" class="hyperlink">Check In & Keep Growing</a></p>
    </div>
    <div class="footer">
      – The Plurawl Team
    </div>
  </div>
</body>
</html>`;

export function generatePositiveAffirmationEmail2(First_Name, CTA_Link) {
  let emailTemplate = HtmlTemplatePositiveAffirmation;

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
    subject: "🚀 Another Week, Another Win—Keep Going!",
  };
}
