const HtmlTemplateVIPAccess = `
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
    .body ul {
      text-align: left;
      list-style-type: disc;
      padding-left: 40px;
    }
    .body ul li {
      text-align: left;
    }
    .body ul li span {
      display: inline-block;
      text-align: left;
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🎉 You’re In—VIP for Life!</div>
    <div class="image-container">
      <img src="https://plurawl-storage.s3.us-east-2.amazonaws.com/VipAccess.png" alt="VIP Access">
    </div>
    <div class="body">
      <p>Hey {First_Name},</p>
      <p>You did it! As an early supporter, you’ve unlocked <span class="bold">VIP access</span> to Plurawl—for life. Yup, we’re always keeping it free for you.</p>
      <p>This is just the beginning. We’re here to help you check in with yourself, track how you’re feeling, and keep growing—no judgment, no interruptions. Just real, raw self-reflection.</p>
      <p>Here’s what’s waiting for you:</p>
      <ul>
        <li><span>All the features, like mood tracking, AI conversation, and personalized insights.</span></li>
        <li><span>Exclusive updates as we keep improving Plurawl.</span></li>
        <li><span>A space to be real with yourself and feel heard.</span></li>
      </ul>
      <p>Ready to Dive In?</p>
      <a href="{CTA_Link}" class="cta"><p class="ctaText">Start Reflecting Now</p></a>
    </div>
    <div class="footer">
      Welcome to the fam,<br>
      The Plurawl Team ✨
    </div>
  </div>
</body>
</html>`;

export function generateVIPAccessEmail(First_Name, CTA_Link) {
  let emailTemplate = HtmlTemplateVIPAccess;

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
    subject: "🎉 You’re In—VIP for Life!",
  };
}
