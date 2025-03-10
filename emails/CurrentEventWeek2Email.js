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
      <img src="https://plurawl-storage.s3.us-east-2.amazonaws.com/Screenshot%202025-03-11%20at%2012.23.33%E2%80%AFAM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA3FLD3NFY742P4XNA%2F20250310%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250310T213618Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE4aCXVzLWVhc3QtMiJGMEQCIBXPs7NH8yKGw2oN29%2BiomKzWgehUXVZyN1ruHlxABm0AiA%2Flht2iw8yPwhDToHkaCBf9D6hXMAwdVnqtCZwRUT4ECr1AgiX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDc2NzM5Nzk0Nzc2MSIM%2BpRto2WgmksnaL4EKskCNmhlnnfvPanXLyDdundbIehIi4%2BRva3ddKTzz4iOVmPxQ2ksQLsZD2tLaLVJTTaP7z4AhqVLyIUZWXV78FG8UySe3WF2w%2FJjuGvToePces4W8pSCWjsBinCz%2BhJZHN0kIWB9jVCSMFM6Jp35QRtEDLdLnhiUSeQYxz%2FkfxsQ0kHix1svjRUvTukMPYHfoiYOYb3OjValT6kxn7VP9g9ULDH6daT1u8saywbuiTKA83S2UfuKCtGOBu3%2BwHWdoJJkprxzj21B8zcYCuLI2y%2Bg7ZNjsMHC%2FBRNSIj7AiIkH2%2FYO%2B1J80MlHpqaLyHpA%2FP072ke%2B9XoTH2PVoCJSNfHhserEQZzxNMt4Y5w3yyyZ7F%2FQJXhgPVaENdSZnT1mHiJki3Y%2FldyRjszyFf1FS3ZwKSLhv2WJIFKdeUKY78v4D8gi5wX%2FKpRwzQw5bS9vgY6tALDkSV37EW9WJlhMA68CPg%2FpfRZxEhpxJhzYYiqyMMhztbzVOxcl7gY0shVBEoCN5l6%2FPP6b7LPM4ONWd19OqhxKMx2%2Bxpx7PTlmJGNYpWHO%2F2Kj1rCKuwHk4FgWcK4JPJp8PvoR3YfdamNTgmFdTneboj6jtNrsYvgqVCZocm2tQM3imcRYfl2LpJ9J%2B4nTHhnBX%2B1Yg8eNiVOhAwwRy8GTEK3Qb6HFGpxHeowJviUVlPL12OaSZWfdffRPejjZByV1voHmwcf5O46Kq1IYE527yWLFs3Q9ma7zsad8smT8mAF0jbtyPargWcY5eq38OQsNo%2FwP0yTv9lBfx6xyfctvAhrzRxq2%2FmqFlA8s2fYZEXnsnr91k2YcQoD81jnNshOoCDPxjLW3QZz5hc7mAhjstOmpQ%3D%3D&X-Amz-Signature=5e2c1a520b02609697badd1f59ed789e83b7f7dbb5f7f9e422bb8901a2f81f5d&X-Amz-SignedHeaders=host&response-content-disposition=inline" alt="The World is Wild">
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
