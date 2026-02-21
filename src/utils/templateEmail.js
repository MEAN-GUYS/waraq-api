const resetPasswordEmail = (reset_url) => `<!DOCTYPE html>
<html lang="ar" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <title>Reset Your Password — Waraq ورق</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a { text-decoration: none; }

    body {
      background-color: #F0EBE1;
      font-family: Georgia, 'Times New Roman', serif;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }

    .email-wrapper {
      background-color: #F0EBE1;
      padding: 48px 16px;
    }

    .email-card {
      background-color: #FDFAF5;
      max-width: 560px;
      margin: 0 auto;
      border-radius: 2px;
      overflow: hidden;
      box-shadow: 0 4px 40px rgba(60, 45, 20, 0.13);
    }

    /* ── HEADER ── */
    .header {
      background-color: #1A1F2E;
      padding: 40px 48px 36px;
      text-align: center;
    }
    .header-rule {
      width: 40px;
      height: 2px;
      background: #C9A84C;
      margin: 0 auto 22px;
    }
    .header-logo-en {
      font-family: Georgia, serif;
      font-size: 11px;
      font-weight: normal;
      color: #8A9BB5;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .header-logo-ar {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 38px;
      font-weight: normal;
      color: #FDFAF5;
      letter-spacing: 0.06em;
      line-height: 1;
      margin-bottom: 6px;
    }
    .header-tagline {
      font-family: Georgia, serif;
      font-style: italic;
      font-size: 11px;
      color: #C9A84C;
      letter-spacing: 0.08em;
      margin-top: 8px;
    }

    /* ── GOLD STRIPE ── */
    .gold-stripe {
      height: 3px;
      background: linear-gradient(90deg, #8B6914, #C9A84C, #D4B96A, #C9A84C, #8B6914);
    }

    /* ── BODY ── */
    .body-wrap {
      padding: 48px 48px 40px;
    }

    /* ── ICON ── */
    .icon-wrap {
      text-align: center;
      margin-bottom: 32px;
    }
    .icon-circle {
      display: inline-block;
      width: 68px;
      height: 68px;
      background-color: #F5F0E8;
      border-radius: 50%;
      border: 2px solid #D8CFC0;
      line-height: 64px;
      font-size: 28px;
      text-align: center;
    }

    /* ── HEADING ── */
    .email-heading {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 24px;
      font-weight: normal;
      color: #1A1F2E;
      text-align: center;
      letter-spacing: 0.02em;
      line-height: 1.35;
      margin-bottom: 6px;
    }
    .heading-ar {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 15px;
      color: #C9A84C;
      text-align: center;
      margin-bottom: 28px;
      letter-spacing: 0.04em;
      font-style: italic;
    }

    /* ── DIVIDER ── */
    .divider {
      height: 1px;
      background: #E0D9CC;
      margin: 24px 0;
    }
    .divider-ornament {
      text-align: center;
      margin: 24px 0;
      color: #C9A84C;
      font-size: 14px;
      letter-spacing: 0.3em;
    }

    /* ── BODY TEXT ── */
    .greeting {
      font-family: Georgia, serif;
      font-size: 15px;
      color: #3A3228;
      margin-bottom: 16px;
      line-height: 1.6;
    }
    .body-text {
      font-family: Georgia, serif;
      font-size: 14px;
      color: #5A5046;
      line-height: 1.85;
      margin-bottom: 16px;
    }

    /* ── CTA BUTTON ── */
    .cta-wrap {
      text-align: center;
      margin: 36px 0;
    }
    .cta-btn {
      display: inline-block;
      background-color: #1A1F2E;
      color: #FDFAF5 !important;
      font-family: Georgia, serif;
      font-size: 12px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      padding: 17px 44px;
      border-radius: 2px;
      text-decoration: none;
    }

    /* ── EXPIRY NOTICE ── */
    .expiry-box {
      background-color: #FBF5E6;
      border-left: 3px solid #C9A84C;
      border-radius: 2px;
      padding: 14px 18px;
      margin-bottom: 24px;
    }
    .expiry-text {
      font-family: Georgia, serif;
      font-size: 12px;
      color: #7A6030;
      line-height: 1.7;
    }
    .expiry-text strong { color: #5A4520; }

    /* ── FALLBACK LINK ── */
    .fallback-wrap {
      background-color: #F5F0E8;
      border: 1px solid #D8CFC0;
      border-radius: 2px;
      padding: 16px 20px;
      margin-top: 8px;
    }
    .fallback-label {
      font-family: Georgia, serif;
      font-size: 10px;
      color: #7A6F60;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .fallback-url {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      color: #2D5FA8;
      word-break: break-all;
      line-height: 1.7;
    }

    /* ── SECURITY NOTE ── */
    .security-note {
      font-family: Georgia, serif;
      font-size: 12px;
      color: #7A6F60;
      line-height: 1.8;
      font-style: italic;
    }

    /* ── WARAQ WATERMARK ── */
    .watermark {
      text-align: center;
      font-family: 'Times New Roman', serif;
      font-size: 64px;
      color: #EDE8DC;
      letter-spacing: 0.04em;
      line-height: 1;
      margin: 8px 0 -8px;
      pointer-events: none;
      user-select: none;
    }

    /* ── FOOTER ── */
    .footer {
      background-color: #1A1F2E;
      padding: 30px 48px 28px;
      text-align: center;
    }
    .footer-rule {
      width: 32px;
      height: 1px;
      background: #C9A84C;
      margin: 0 auto 18px;
    }
    .footer-brand {
      margin-bottom: 14px;
    }
    .footer-logo-ar {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 22px;
      color: #FDFAF5;
      letter-spacing: 0.06em;
      display: block;
    }
    .footer-logo-en {
      font-family: Georgia, serif;
      font-size: 9px;
      color: #4A5568;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      display: block;
      margin-top: 2px;
    }
    .footer-links {
      margin-bottom: 14px;
    }
    .footer-link {
      font-family: Georgia, serif;
      font-size: 10px;
      color: #8A9BB5 !important;
      letter-spacing: 0.06em;
      margin: 0 10px;
      text-decoration: none;
    }
    .footer-address {
      font-family: Georgia, serif;
      font-size: 10px;
      color: #3A4558;
      line-height: 1.8;
    }
    .footer-unsubscribe {
      font-family: Georgia, serif;
      font-size: 10px;
      color: #3A4558;
      margin-top: 10px;
      line-height: 1.7;
    }
    .footer-unsubscribe a {
      color: #6A7FA8 !important;
      text-decoration: underline;
    }

    @media only screen and (max-width: 600px) {
      .body-wrap { padding: 32px 24px 28px !important; }
      .header { padding: 28px 24px 24px !important; }
      .footer { padding: 24px 24px !important; }
      .email-heading { font-size: 20px !important; }
      .header-logo-ar { font-size: 30px !important; }
      .cta-btn { padding: 14px 28px !important; }
    }
  </style>
</head>
<body>
<div class="email-wrapper">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">
        <div class="email-card">

          <!-- ── HEADER ── -->
          <div class="header">
            <div class="header-rule"></div>
            <div class="header-logo-en">Waraq</div>
            <div class="header-logo-ar">ورق</div>
            <div class="header-tagline">Where every page tells a story</div>
          </div>

          <!-- ── GOLD STRIPE ── -->
          <div class="gold-stripe"></div>

          <!-- ── BODY ── -->
          <div class="body-wrap">

            <!-- Watermark -->
            <div class="watermark">ورق</div>

            <!-- Icon -->
            <div class="icon-wrap">
              <div class="icon-circle">🔑</div>
            </div>

            <!-- Heading -->
            <h1 class="email-heading">Password Reset Request</h1>
            <p class="heading-ar">— طلب إعادة تعيين كلمة المرور —</p>

            <div class="divider"></div>


            <!-- Body -->
            <p class="body-text">
              Click the button below to set a new password. This link is single-use and will expire shortly.
            </p>

            <!-- CTA -->
            <div class="cta-wrap">
              <a href="${reset_url}" class="cta-btn" target="_blank">
                Reset My Password
              </a>
            </div>

            <!-- Expiry Notice -->
            <div class="expiry-box">
              <p class="expiry-text">
                ⏱ <strong>This link expires in 30 minutes.</strong> After expiry, you can request a new reset link from the login page.
              </p>
            </div>

            <!-- Fallback URL -->
            <p class="body-text" style="margin-bottom:8px; font-size:13px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <div class="fallback-wrap">
              <div class="fallback-label">Reset Link</div>
              <div class="fallback-url">${reset_url}</div>
            </div>

            <div class="divider-ornament">· · ·</div>

            <!-- Security Note -->
            <p class="security-note">
              If you did not request a password reset, you can safely ignore this email — your password will not change. If you have concerns, please contact us at <a href="mailto:support@waraq.com" style="color:#2D5FA8;">support@waraq.com</a>.
            </p>

          </div>
          <!-- /BODY -->

          <!-- ── FOOTER ── -->
          <div class="footer">
            <div class="footer-rule"></div>
            <div class="footer-brand">
              <span class="footer-logo-ar">ورق</span>
              <span class="footer-logo-en">Waraq · Your Literary Companion</span>
            </div>
            <div class="footer-links">
              <a href="#" class="footer-link">Help</a>
              <a href="#" class="footer-link">Privacy</a>
              <a href="#" class="footer-link">Terms</a>
              <a href="#" class="footer-link">Contact</a>
            </div>
            <div class="footer-address">
              Waraq ورق · support@waraq.com
            </div>
            <div class="footer-unsubscribe">
              This email was sent because a password reset was requested for your account.<br/>
              <a href="${reset_url}">Unsubscribe from security emails</a>
            </div>
          </div>

        </div>
      </td>
    </tr>
  </table>
</div>
</body>
</html>`;

module.exports = {
  resetPasswordEmail,
};
