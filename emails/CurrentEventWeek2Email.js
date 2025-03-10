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
    <div class="header">💭 The World is Wild</div>
    <div class="image-container">
      <img src="https://i.ibb.co/PGRhTFg2/Screenshot-2025-03-11-at-12-23-33-AM.png" alt="The World is Wild">
    </div>
    <div class="body">
      <p>Hey {First_Name},</p>
      <ul>
        <li>Listen. The world is doing way too much right now.</li>
        <li>Whether it’s the latest news cycle, social media drama, or just the weight of it all—we’re feeling it, too. 😩</li>
        <li>But here’s the thing: You don’t have to carry all of that on your own.</li>
        <li>Plurawl is your space to unpack, process, and take a breath.</li>
        <li>You can speak your truth, free of judgment. No filters, no stress, just <span class="bold">realness</span>.</li>
        <li><span class="bold">Here’s How To Get It Off Your Chest:</span></li>
        <li><span class="bold">Tap to check in</span>—how’s your mental space today?</li>
        <li><span class="bold">Journal your thoughts</span>—whether it’s the news, your emotions, or just life in general, let it out.</li>
        <li><span class="bold">Track your progress</span>—you’ll start to see patterns in your feelings and get the clarity you need to keep moving forward.</li>
        <li><span class="bold">Ready to Breathe Again?</span></li>
      </ul>
      <a href="{CTA_Link}" class="cta"><p class="ctaText">Check In & Let It Out</p></a>
    </div>
    <div class="footer">
      You’ve got this,<br>
      The Plurawl Team 💛
    </div>
  </div>
</body>
</html>`;

export function generateCurrentEventEmail(First_Name, CTA_Link) {
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
    subject: "💭 The World is Wild",
  };
}
