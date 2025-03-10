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
      <img src="https://plurawl-storage.s3.us-east-2.amazonaws.com/Screenshot%202025-03-10%20at%2011.36.48%E2%80%AFPM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA3FLD3NFYVOR3L7ZT%2F20250310%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250310T214029Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE4aCXVzLWVhc3QtMiJHMEUCIQC2qvRPROtSg2qf2Zmm3K0SYPOjmW6GRpF75ewONXj6SQIgEtvBYXFJwwSxrhjr3iotr2EOXJUkOfrbLSPNvzbg%2Bd0q9QIIl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw3NjczOTc5NDc3NjEiDA0R76iwNG%2BmbfyK9CrJAuPZrVpX1EpBgnl1oNbNZMQ%2BmhL5bMAbWi1cIgXVYwFjup1x1Y8yemMfmfD1Q9LkMx7g6Wt%2Bz8n5AZlk1mE%2BI2ucBqfVRig7qdo2m6iFXTCrEmRojGil12DsODb9SMrZLs53QU4FwVqLDWiWZivtT%2FiNrJOMK1hcVLdGAhByCJjgGDQ6h28WE3CAp4TYubvdKsrih6nb9knvLVU9L5M7BDUzVjnL%2BxNtjlG%2FhkP8qTIWYI3FfBUcgAMEbt8HR7JEftk%2B5kP6bDDSbc0Ga005infbOkMXk%2F0f8YW38knPRfty6eq0oVSWkUjtsIJ9U0qy%2F6xbBNsXbAwbNkGrkPWDW7QPYZG8to9IT2ExU2tTcr1scg9qZTlTck3sg55A7v8mFZW6JptcpJLcb2dEawPfg65lKpj4tRrN70x4vlUj2b0x6igGd%2FuY4O59MOW0vb4GOrMCEKJbwYO%2Fmb7ZzxuG8P%2BmPa7N%2Fd1CQpltjQx9%2BUzooRC7b7PPU7Dkdm%2BHm5Kmm5kZSE9WIwz%2FBt1kwdUPNqwJADFCe4YX1Knk4tzszUcGL4GdW%2ByW8LsoX0CaZZ2HzdNYLzVTJSXO2rAfQRKcAD1L2%2Fy3M8RbwenKuVSLkxoH%2BA%2FS2UTaQDm%2FiQQtnewfcjJXOLL5vzY94kUTF5MW375TggDQ9VY5qVszopvyHdy1jn0cAmCYKL5E7wSTE%2B3IMheRBBkG9WD1Ognib2uSQBuPVYFzoK%2FNYB2lJmcHKcI%2Bd5sFCHEcX%2BCoNp0xWBrd81JJQZiYG6%2FWfyP4s6%2BWLUCz4CtoT0y%2FDcifvSMDibxPU6A2WjUZG8UklGCLiYKXToramT5RDSBuN4kMfTHWwUapLiUuKA%3D%3D&X-Amz-Signature=9219404c426f63aab1630fb6c1cd10b35302ad879ae0addd787e5d7904675ba0&X-Amz-SignedHeaders=host&response-content-disposition=inline" alt="VIP Access">
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
