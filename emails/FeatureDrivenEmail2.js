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
    <div class="header">🌱 Take It One Step at a Time</div>
    <div class="image-container">
      <img src="https://i.ibb.co/6Rrd3bcw/Screenshot-2025-03-10-at-11-36-48-PM.png" alt="VIP Access">
    </div>
    <div class="body">
      <p>Hey {First_Name},</p>
      <ul>
        <li>Life can be a lot sometimes, and that’s okay. Plurawl is here to help you take it one step at a time—because small wins add up to big changes.</li>
        <li>No need to do it all at once. Journaling is all about getting real with yourself, one thought at a time.</li>
        <li><span class="bold">How To Get Started:</span></li>
        <li><span class="bold">Tap to check in</span>—how are you feeling today?</li>
        <li><span class="bold">Write one thing down</span>—even if it’s just a brain dump. We’ll help you make sense of it.</li>
        <li><span class="bold">Track your progress</span>—watch your emotions evolve over time.</li>
        <li>That’s it! Just take one step today. You’re already doing more than you know.</li>
        <li><span class="bold">Start Now:</span></li>
      </ul>
      <a href="{CTA_Link}" class="cta"><p class="ctaText">Let’s Get Started</p></a>
    </div>
    <div class="footer">
      You’ve got this,<br>
      The Plurawl Team 💫
    </div>
  </div>
</body>
</html>`;

export function generateFeatureDrivenEmail2(First_Name, CTA_Link) {
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
    subject: "🌱 Take It One Step at a Time",
  };
}
