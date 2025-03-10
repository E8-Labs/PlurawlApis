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
    <div class="header">💪🏾 You’re Built For It</div>
    <div class="image-container">
      <img src="https://i.ibb.co/rRBF0D43/Screenshot-2025-03-11-at-12-49-42-AM.png" alt="VIP Access">
    </div>
    <div class="body">
      <p>Hey {First_Name},</p>
      <ul>
        <li>You’ve been through some things—and you’re still standing strong. 💯</li>
        <li>Every challenge? You’ve come out stronger. <span class="bold">Period.</span></li>
        <li>So what’s one win you’ve had today? Even if it’s just making it through—<span class="bold">that counts.</span> 🙌🏾</li>
        <li>Plurawl is here to help you <span class="bold">see your growth</span>, one journal entry at a time.</li>
        <li>Every day is a chance to reflect and recognize that you’re doing the work, even on the tough days.</li>
        <li><span class="bold">Here’s How To Reflect & Celebrate:</span></li>
        <li><span class="bold">Tap to check in</span>—How are you really feeling today?</li>
        <li><span class="bold">Write it down</span>—Even the small wins matter. What are you proud of today?</li>
        <li><span class="bold">Track your progress</span>—See your growth and how far you’ve come.</li>
        <li><span class="bold">Keep winning.</span> The real glow-up happens when you give yourself the credit you deserve. ✨</li>
        <li><span class="bold">Ready to Claim Your Wins?</span></li>
      </ul>
      <a href="{CTA_Link}" class="cta"><p class="ctaText">Celebrate Your Win</p></a>
    </div>
    <div class="footer">
      We got you,<br>
      The Plurawl Team 💛
    </div>
  </div>
</body>
</html>`;

export function generatePositiveAffirmation3Week2Email(First_Name, CTA_Link) {
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
    subject: "💪🏾 You’re Built For It",
  };
}
