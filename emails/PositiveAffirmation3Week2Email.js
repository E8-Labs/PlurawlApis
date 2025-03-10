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
      <img src="https://plurawl-storage.s3.us-east-2.amazonaws.com/Screenshot-2025-03-11-at-12-49-42-AM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA3FLD3NFY3IFMVLZR%2F20250310%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250310T214254Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE4aCXVzLWVhc3QtMiJIMEYCIQDqUzNJTFT%2F1%2FUpNEOY0NoqxvuYRR%2BcwswVQ6Cb3dMO5wIhAJweS1qFYSFVLVYNhkgvw1C5reHPZXXtKbghZefX7IILKvUCCJf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNzY3Mzk3OTQ3NzYxIgyrXhbPSETAr5p1K6wqyQJ7YeG0Y2fJKHZ43qom%2FMFR4C9ruy3nzZjtWeZN%2FbkygNX3nklSbXp02%2Fgq9fqYO3UloGNXF%2FecgBM%2FBvI6346Z4f0qh4C1Ii5nFSKseDBI0qjN4JVTa7atgPxd1VT1bK%2FMXIWubjVqSxpWSyxRU8mxmXizvO2U7Gx6WwErktJRa%2BNIxfyg8Je88BDe7y%2B4Q%2Btv%2BO7Ng9hpyuIhtgFljTQ9DR0yYJdbNg2cbKX3gQyH%2Bfu7e2o5sLE2qXhVxr6%2Fs%2Fo5i73WPSPp72O5UJJAda7ZbyzkfWcixlRjnfczjB%2FaypMD%2BQnqKPGnNZx%2BpcA4Aw4la3rR%2BH92P83vXJluL38b2GHbxtO4ECO6huOEW6xZjC1z42%2B%2B2kTQ67cdqlndcr6m%2F%2BNu2O0XUPU3ibwdb0Rj0pgpMvXT1%2Flx6%2Bc1JsiMG6oX%2B7UD7%2BfgcDDltL2%2BBjqyAqzUBS11QyyCo%2BkV%2F78dZL7C7CLC74o5KN8tZf6p6p7fyABqxqBiXPoxxqkV2QzFPm85GHbgcFwpkk%2B%2Bu7OkndF0A4TLpc39o%2F4U2RWGMqgbsM76KqnxpaTlAUonkO6KrHs1HbvV2%2FOco84xE5QsHObI%2FgAQUYbIVvcjJrDBtNlbyMBb1V%2FsIGWNgS0zLd7s1vPayGGG%2B2ykk326C1Hdw%2BcPCQFr6aD3ogX%2Fp3LnhKZ2T1YjY%2Bpk%2BvuRBtWCnjnvUf4iI8cP3MpOF8kNj%2BWYM7S%2BqfSqgge0dLzRs2c6BWC4Xn5YxpjFDtrUL04UDymVR%2FQByXeJkWoQHE2MQIElcaTYef6JzXu362oI7acPcd%2Fw9A6F2bth%2FX0d4hZR8fOmmGiK3fyo7AoSxxXjUj3%2FMzTZ0g%3D%3D&X-Amz-Signature=83ef823a17144ceb4362f4e04d177d3b80cd5540910538d886eb53e66525b676&X-Amz-SignedHeaders=host&response-content-disposition=inline" alt="VIP Access">
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
