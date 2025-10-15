import mjml2html from "mjml";

export const generateVerificationEmail = (code: string, link: string) => {
    const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const safeCode = escapeHtml(code);
  const safeLink = escapeHtml(link);
  const mjmlTemplate = `
  <mjml>
    <mj-head>
      <mj-title>Verify Your Email Address</mj-title>
      <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
      <mj-attributes>
        <mj-all font-family="Roboto, Arial, sans-serif" />
      </mj-attributes>
      <mj-style>
        .token-container { background-color: #f5f7fa; border-radius: 8px; font-family: monospace; letter-spacing: 5px; } 
        .verification-button { border-radius: 6px; transition: all 0.3s ease; } 
        .footer-text { color: #98a2b3; }
      </mj-style>
    </mj-head>
    <mj-body background-color="#ffffff">
      <mj-section background-color="#ffffff">
        <mj-column>
          <mj-text font-size="24px" font-weight="500" color="#1f2937" align="center" padding-bottom="20px">
            Verify Your Email Address
          </mj-text>
          <mj-text font-size="16px" color="#4b5563" line-height="24px" padding-bottom="16px">
            Thanks for signing up! Please verify your email address to complete your registration.
          </mj-text>
          <mj-text font-size="16px" color="#4b5563" line-height="24px" padding-bottom="24px">
            Your verification code:
          </mj-text>

          <mj-text css-class="token-container" font-size="28px" font-weight="bold" color="#111827" align="center" padding="20px">
            ${safeCode}
          </mj-text>

          <mj-spacer height="24px" />

          <mj-text font-size="16px" color="#4b5563" line-height="24px" padding-bottom="24px">
            Alternatively, you can directly verify your account by clicking the button below:
          </mj-text>

          <mj-button css-class="verification-button" background-color="#0070f3" color="white" font-size="16px" font-weight="500" border-radius="6px" inner-padding="15px 25px" href="${safeLink}">
            Verify My Email
          </mj-button>

          <mj-spacer height="24px" />

          <mj-text font-size="16px" color="#4b5563" line-height="24px">
            If you didn't sign up for this account, you can safely ignore this email.
          </mj-text>
        </mj-column>
      </mj-section>
      <!-- Footer section remains the same -->
    </mj-body>
  </mjml>
  `;

  return mjml2html(mjmlTemplate).html;
};
