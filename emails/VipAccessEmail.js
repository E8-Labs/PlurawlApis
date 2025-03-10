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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🎉 You’re In—VIP for Life!</div>
    <div class="image-container">
      <img src="https://plurawl-storage.s3.us-east-2.amazonaws.com/VipAccess.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA3FLD3NFYXHZY2IGZ%2F20250310%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250310T213432Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE4aCXVzLWVhc3QtMiJHMEUCIFgQ1jM7ugIx7x%2B36nbkpJpuumyFPEOXhTfTn58GkBKXAiEAvO8TcVV8GDZsrdxuCEIyP1sqmPytumO5tZ0T9yN%2BXq8q9QIIl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw3NjczOTc5NDc3NjEiDN6aPABbYhv3WKBneSrJAg%2FoHbc%2FOhb95vcJzDttH40VoVmlJ0D%2BJOhG6m2d51toLZ4mq3vudZR2j78Vewzs92pRth%2FXw2sL%2FpU4C6AH0QBBMxknPOzSn9jCDaC7PuzTY%2FQJ8YJyRA%2Fm8XpT9XM6WKQgTKRd4cqq8c8Q6qJyealbt7d8UUbOB6ReN10KcBo7GFn1Pxq4xaRdrYwOXy14rxOJfoZtNbEUaAwCOIva5hfaOdxlpEpjhJ1apYhw1GfukaAyxeYmCtvH80TGwjatnlOJZORcWELRi9cHR5weC%2B5%2BNB%2FZtBplKCZca608K01KFgcGRcH5MPbghh%2FInE7L72rnyQsA87roPYRe%2BhIYXd8%2FemRrHmCq9HNaRCtFjfE5wIMfjxU2gMoFI8IM9HC4wgjkcv7Y0mqXVLu3HsdBh9hzT4CfUWXwTBd6XCDUvD7Is5Qhp7UASkrIMOW0vb4GOrMC2mfux2ZSl%2B9BYoCZP8VL52zXOsZ1u7e2m5N0X2Rlulvj7WLHiIzI16jKvmQKeNi%2FgY5di2tNhYajk%2BJy3QoyZ9Jm%2BEQjP4iAX2fuiuwzKHnXA7Wp4YBOOY5EQLNPkzymtYTPtds4zx60Pl5QJwt6I0%2FvXYIMg2TfdOWirveEzQKGLhmD5pknmbB9BQB9m0saBSrQ9ugDtQTCHcDp6VFHrUV2o8V2u4zwadsTjU4jTgkJiqlH87p1PhGWo5xQUq8i9%2FQ7ULPwIXuRn8kL5zIjHiogvyG1S6DNBHS%2FWqhIAT3oDqx%2FPQX25QmmpokX4rlxi1u6iwmkk8Mpw9VPA2%2FxNX0juHAZ5u0rQ9QoqNj9kS0cSk7rEz6j7xnj008eb%2Bh4NSmeNQzbfQO7sotwVwulxgQWkA%3D%3D&X-Amz-Signature=9be560bed0d44e2983bf1bb2018eb3e943af501246606abf276c85fe9c8dc56f&X-Amz-SignedHeaders=host&response-content-disposition=inline" alt="VIP Access">
    </div>
    <div class="body">
      <p>Hey {First_Name},</p>
      <p>You did it! As an early supporter, you’ve unlocked <span class="bold">VIP access</span> to Plurawl—for life. Yup, we’re always keeping it free for you.</p>
      <p>This is just the beginning. We’re here to help you check in with yourself, track how you’re feeling, and keep growing—no judgment, no interruptions. Just real, raw self-reflection.</p>
      <p>Here’s what’s waiting for you:</p>
      <ul>
        <li>All the features, like mood tracking, AI conversation, and personalized insights.</li>
        <li>Exclusive updates as we keep improving Plurawl.</li>
        <li>A space to be real with yourself and feel heard.</li>
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
