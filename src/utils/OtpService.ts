import nodemailer from 'nodemailer';
import { OtpModel } from '../model/OtpModel';
import otpGenerator from 'otp-generator';
import config from '../config';

   const transporter = nodemailer.createTransport({
      service: 'gmail',
      // host: process.env.SMTP_HOST,    // SMTP host
      port: parseInt(config.smtp_port || "587"), // SMTP port
      secure: config.smtp_port === "465",       // Secure if using port 465
      auth: {
        user: config.smtp_user, // SMTP username
        pass: config.smtp_pass, // SMTP password
      },
    });

    console.log("smtp " , config.smtp_user, config.smtp_pass);


const sendOtpEmail = async (email: string, otp: string) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: #333;">Your Verification Code</h2>
        <p style="font-size: 16px; color: #555;">Dear User,</p>
        <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; background-color: #007bff; color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #888;">This OTP is valid for <strong>5 minutes</strong>.</p>
        <p style="font-size: 14px; color: #888;">If you did not request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">Thank you for using our service.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Foode Heven" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your OTP Code - Foode Heven App Verification',
    html: htmlContent,
  });

  console.log("OTP sent to", email, ":", otp);
};


const generateOtp = async (email: string) => {
  const otp = otpGenerator.generate(6, {
    digits: true,                  // Only digits
    upperCaseAlphabets: false,     // No uppercase letters
    lowerCaseAlphabets: false,     // No lowercase letters
    specialChars: false            // No special characters
  });

  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiration

  await OtpModel.create({ email, otp, expiresAt });
  await sendOtpEmail(email, otp);
};

const verifyOtp = async (email: string, otp: string) => {
  const otpDoc = await OtpModel.findOne({ email, otp });
  if (!otpDoc) {
    throw new Error('Invalid OTP');
  }
  if (otpDoc.expiresAt < new Date()) {
    throw new Error('OTP expired');
  }
  // Optionally, delete OTP after verification
  await OtpModel.deleteOne({ _id: otpDoc._id });
  return true;
};

export const OtpService = {
  generateOtp,
  verifyOtp,
};
