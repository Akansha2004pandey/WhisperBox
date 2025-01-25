"use server"
import nodemailer from 'nodemailer';
import VerificationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',  
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,  
      },
    });

    
    const emailHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>WhisperBox Verification Code</h2>
      <p>Hello ${username},</p>
      <p>Your verification code is: <strong>${verifyCode}</strong></p>
      <p>Please use this code to verify your account.</p>
    </div>
  `;
    
    const info = await transporter.sendMail({
        from: 'akanshaoptimist@gmail.com',  
        to: email,  
        subject: 'WhisperBox Verification Code',  
        html: emailHtml,
    });


    return {
      success: true,
      message: `Verification email sent successfully to ${email}.`,
    };
  } catch (emailError: any) {

    console.error('Error sending verification email:', emailError);

    return {
      success: false,
      message: emailError.message || 'Failed to send verification email.',
    };
  }
}
