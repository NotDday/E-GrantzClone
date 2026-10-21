const nodemailer = require('nodemailer');

const createTransporter = () => {
  // If SMTP credentials are configured, use real email
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  // Dev fallback: log to console instead of sending
  return null;
};

const sendOtpEmail = async (to, name, otp) => {
  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden;">
      <div style="background: #002147; padding: 20px; text-align: center;">
        <h2 style="color: #fff; margin: 0;">e-grantz <span style="color: #ffb71c;">3.0</span></h2>
        <p style="color: #c6d3e2; margin: 4px 0 0 0; font-size: 13px;">Single Window Scholarship Portal</p>
      </div>
      <div style="padding: 30px 24px;">
        <p style="color: #333; font-size: 15px;">Hello <strong>${name}</strong>,</p>
        <p style="color: #555; font-size: 14px;">You requested a password reset. Use the OTP below — valid for <strong>10 minutes</strong>.</p>
        <div style="text-align: center; margin: 28px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #002147; background: #f0f4ff; padding: 14px 28px; border-radius: 6px; display: inline-block;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 12px;">If you did not request this, ignore this email. Your password will remain unchanged.</p>
      </div>
      <div style="background: #f9f9f9; padding: 12px 24px; text-align: center; font-size: 11px; color: #aaa;">
        &copy; e-Grantz 3.0 &mdash; Government of Kerala
      </div>
    </div>
  `;

  if (!transporter) {
    // Dev mode: print OTP to console
    console.log('\n========================================');
    console.log(`[DEV EMAIL] OTP for ${to}: ${otp}`);
    console.log('========================================\n');
    return { dev: true, otp };
  }

  await transporter.sendMail({
    from: `"e-Grantz 3.0" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Password Reset OTP — e-Grantz 3.0',
    html
  });

  return { sent: true };
};

module.exports = { sendOtpEmail };
