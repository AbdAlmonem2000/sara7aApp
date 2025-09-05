export const template = (code, firstName) => {
  return `<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>Your Verification Code</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .wrapper { background:#0b0f14 !important; }
      .card { background:#121820 !important; color:#e6eef8 !important; }
      .muted { color:#9bb0c8 !important; }
      .code { background:#0b1220 !important; color:#e6eef8 !important; border-color:#284569 !important; }
      .btn { background:#2b78ff !important; color:#ffffff !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="wrapper" style="background:#f5f7fb;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="padding:0 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="card" style="background:#ffffff;border-radius:14px;padding:24px;border:1px solid #e7ecf5;font-family:Segoe UI, Roboto, Arial, sans-serif;color:#0f1b2d;">
                <tr>
                  <td style="text-align:center;padding-bottom:8px;">
                    <div style="font-size:18px;font-weight:600;letter-spacing:0.2px;">Your Verification Code</div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:8px 0 2px 0;font-size:14px;line-height:1.5;">
                    Hi <strong>${firstName}</strong>,
                  </td>
                </tr>

                <tr>
                  <td class="muted" style="padding:0 0 14px 0;font-size:14px;line-height:1.5;color:#3d4b63;">
                    Use the code below to verify your email. It expires in 10 minutes.
                  </td>
                </tr>

                <tr>
                  <td>
                    <div class="code" style="display:inline-block;font-family:Consolas, Menlo, Monaco, monospace;font-size:24px;letter-spacing:4px;font-weight:700;background:#f1f6ff;border:1px solid #cfe0ff;color:#0f1b2d;padding:12px 18px;border-radius:10px;white-space:nowrap;">
                      ${code}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:18px;">
                    <a class="btn" href="#" style="display:inline-block;text-decoration:none;background:#1a73e8;color:#ffffff;font-weight:600;font-size:14px;padding:10px 16px;border-radius:10px;">
                      Verify Now
                    </a>
                  </td>
                </tr>

                <tr>
                  <td class="muted" style="padding-top:18px;font-size:12px;line-height:1.6;color:#6b7a99;">
                    If you didn’t request this, you can safely ignore this email.
                  </td>
                </tr>

                <tr>
                  <td style="padding-top:16px;border-top:1px solid #eef2f8;margin-top:16px;font-size:11px;color:#8a96ab;">
                    © ${new Date().getFullYear()} Your Company
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Your verification code is ${code}.
  </div>
</body>
</html>`;
};
