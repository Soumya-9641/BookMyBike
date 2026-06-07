// src/apis/user/auth.api.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../Models/User";
import { sendEmail } from "../../Utils/sendEmail";
import crypto, { randomBytes } from "crypto";
import twilio from "twilio";
import dotenv from "dotenv";
import { authMiddleware } from "../../Middlewares/auth.middleware";
import { AuthRequest } from "../../types/auth-request";
import { Types } from "mongoose";
import fs from "fs";
import path from "path";
dotenv.config();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const router = Router();
const logoPath = path.join(
  process.cwd(),
  "uploads",
  "logo",
  "logo.jpeg"
);

const logoBase64 = fs.readFileSync(logoPath, {
  encoding: "base64",
});
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      personalProfile: {
        firstName,
        lastName,
        isVerified: false,
        phone: phoneNumber
      }
    });
    console.log("Saved token:", user.emailVerificationToken);
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendEmail(
      normalizedEmail,
      "Verify your email",
      `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Verify Your Email</title>
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i&display=swap" rel="stylesheet">
  </head>
  <body style="background:#fff; margin:0; padding:0; font-family:Source Sans Pro,sans-serif;">
    <table style="width:80%; max-width:800px; border:none; background:#fff; margin:30px auto">
      <thead>
        <tr>
          <th>
            <img alt="Logo"
    src="cid:rentmybikelogo"
    width="140"
    style="display:block; margin:0 auto;">
          </th>
        </tr>
      </thead>
      <tbody style="width:100%">
        <tr style="width:100%">
          <td>
            <div style="background:#F6F6F6; padding:15px; box-shadow:0px 1px 5px rgba(0,0,0,0.15); border-top:8px solid #17a34a; text-align:center; border-radius:5px">
              
              <h3 style="font-size:30px; font-weight:400; margin:5px 0 10px">
                Hi ${firstName ?? "there"},
              </h3>
              <p style="font-size:20px; font-weight:400; margin:5px 0 10px; text-transform:capitalize">
                You are one step away
              </p>
              <h2 style="font-size:36px; font-weight:400; margin:5px 0 10px; text-transform:capitalize">
                Verify your email address
              </h2>
              <p style="font-size:20px; font-weight:400; margin:5px 0 10px; text-transform:capitalize">
                To complete your profile you'll need to verify your email address.
              </p>

              <a style="width:150px; height:40px; font-size:20px; font-weight:600; color:#fff; background:#17a34a; text-decoration:none; padding:5px 22px; margin:35px auto; display:block; line-height:40px; box-shadow:0px 1px 5px rgba(0,0,0,0.35); border-radius:5px; text-transform:capitalize"
                rel="noopener noreferrer"
                target="_blank"
                href="${verifyUrl}"
                title="Verify address">
                Verify email
              </a>

              <p style="font-size:14px; color:#999999; margin:20px 0 10px;">
                ⏱ This link expires in <strong>24 hours</strong>. 
                If you did not create an account, you can safely ignore this email.
              </p>

            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
  </html>`
    );

    res.status(201).json({
      message: "Verification email sent. Please verify your email."
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
// router.get("/verify-email", async (req: Request, res: Response) => {
//   try {
//     const { token } = req.query;
//     console.log(token)
//     const user = await User.findOne({
//       emailVerificationToken: token
//     });
//     //@ts-ignore
//     console.log(user._id);

//     if (!user) {
//       return res.status(400).send("Invalid or expired verification link");
//     }

//     user.emailVerified = true;
//     user.emailVerificationToken = undefined;
//     user.emailVerificationExpires = undefined;

//     await user.save();
//     return res.status(200).send("Email verified successfully");
//     //res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
//   } catch (error: any) {
//     res.status(500).send("Email verification failed");
//   }
// });
router.get("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
    });

    // ✅ TOKEN ALREADY USED BUT EMAIL VERIFIED
    if (!user) {
      const alreadyVerifiedUser = await User.findOne({
        emailVerified: true,
      });

      if (alreadyVerifiedUser) {
        return res
          .status(200)
          .json({ message: "Email already verified" });
      }

      return res
        .status(400)
        .json({ message: "Invalid or expired verification link" });
    }

    // ✅ NORMAL SUCCESS
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: "Email verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Email verification failed" });
  }
});
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.systemRole !== "user") {
      const error: any = new Error("Access denied: Not an user account");
      error.statusCode = 403;
      throw error;
    }
    if (!user.emailVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in"
      });
    }

    if (user.isBlocked) {
      return res.status(401).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, systemRole: user.systemRole },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      token,
      hasBusinessProfile: user.businessProfile?.isActive || false
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/resend-verification", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {

      return res.json({
        message: "If the email exists, a verification link has been sent"
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        message: "Email is already verified"
      });
    }


    const verificationToken = crypto.randomBytes(32).toString("hex");

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendEmail(
      user.email,
      "Verify your email",
      `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i&display=swap" rel="stylesheet">
      </head>
      <body style="background:#fff; margin:0; padding:0; font-family:Source Sans Pro,sans-serif;">
        <table style="width:80%; max-width:800px; border:none; background:#fff; margin:30px auto">
          <thead>
            <tr>
              <th>
                <img alt="Logo"
    src="cid:rentmybikelogo"
    width="140"
    style="display:block; margin:0 auto;">
              </th>
            </tr>
          </thead>
          <tbody style="width:100%">
            <tr style="width:100%">
              <td>
                <div style="background:#F6F6F6; padding:15px; box-shadow:0px 1px 5px rgba(0,0,0,0.15); border-top:8px solid #17a34a; text-align:center; border-radius:5px">
                  
                  <h3 style="font-size:30px; font-weight:400; margin:5px 0 10px">
                    Hi ${user.personalProfile?.firstName ?? "there"},
                  </h3>
                  <p style="font-size:20px; font-weight:400; margin:5px 0 10px; text-transform:capitalize">
                    You are one step away
                  </p>
                  <h2 style="font-size:36px; font-weight:400; margin:5px 0 10px; text-transform:capitalize">
                    Verify your email address
                  </h2>
                  <p style="font-size:20px; font-weight:400; margin:5px 0 10px; text-transform:capitalize">
                    To complete your profile you'll need to verify your email address.
                  </p>

                  <a style="width:150px; height:40px; font-size:20px; font-weight:600; color:#fff; background:#17a34a; text-decoration:none; padding:5px 22px; margin:35px auto; display:block; line-height:40px; box-shadow:0px 1px 5px rgba(0,0,0,0.35); border-radius:5px; text-transform:capitalize"
                    rel="noopener noreferrer"
                    target="_blank"
                    href="${verifyUrl}"
                    title="Verify address">
                    Verify email
                  </a>

                  <p style="font-size:14px; color:#999999; margin:20px 0 10px;">
                    ⏱ This link expires in <strong>24 hours</strong>.
                    If you did not create an account, you can safely ignore this email.
                  </p>

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>`
    );

    return res.status(200).json({
      message: "Verification email sent. Please check your inbox."
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to resend verification email",
      error: error.message
    });
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User with this email does not exist"
      });
    }

    const resetToken = randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Reset your password",
      `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body style="margin:0;padding:0;background-color:#f0f0f0;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f0f0;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

              <!-- Logo Section -->
              <tr>
                <td align="center" style="background-color:#ffffff;padding:24px 40px;border-bottom:3px solid #2e7d32;">
                  <img  alt="Logo"
    src="cid:rentmybikelogo"
    width="140"
    style="display:block; margin:0 auto;"/>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td align="center" style="padding:48px 40px 32px;">
                  <p style="margin:0 0 6px;color:#444444;font-size:16px;">
                    Hi Mr. ${user.personalProfile?.firstName ?? "there"},
                  </p>
                  <p style="margin:0 0 16px;color:#444444;font-size:15px;">
                    You requested a password reset
                  </p>
                  <h1 style="margin:0 0 20px;color:#1a1a1a;font-size:28px;font-weight:700;">
                    Password Reset
                  </h1>
                  <p style="margin:0 0 36px;color:#666666;font-size:15px;line-height:1.6;max-width:440px;">
                    Click the button below to reset your password. This link expires in <strong>1 hour</strong>.
                  </p>

                  <!-- Green Button -->
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto 36px;">
                    <tr>
                      <td align="center" style="background-color:#2e7d32;border-radius:6px;">
                        <a href="${resetUrl}"
                           style="display:inline-block;padding:16px 48px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0;color:#999999;font-size:13px;text-align:center;">
                    If you didn't request a password reset, you can safely ignore this email.<br/>
                    Your password will remain unchanged.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f9f9f9;padding:20px 40px;border-top:1px solid #eeeeee;">
                  <p style="margin:0;color:#bbbbbb;font-size:12px;text-align:center;">
                    © ${new Date().getFullYear()} Your Company. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`

    );

    return res.status(200).json({
      message: "Password reset link sent successfully"
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});



router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const { password } = req.body;
    console.log(token)
    if (!password) {
      return res.status(400).json({
        message: "New password is required"
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link"
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful. Please login."
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/send-otp", async (req: AuthRequest, res: Response) => {

  try {

    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    const existingUser = await User.findOne({
      "personalProfile.phone": phoneNumber
    });

    // if (existingUser) {
    //   return res.status(400).json({
    //     message: "Phone number already in use"
    //   });
    // }

    //  await User.findByIdAndUpdate(
    //   req.user!.userId,
    //   {
    //     $set: {
    //       "personalProfile.phone": phoneNumber,
    //       "personalProfile.isVerified": false
    //     }   
    //   }
    // );
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID as string)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }

})

router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID as string)
      .verificationChecks.create({
        to: phoneNumber,
        code: otp,
      });

    if (verification.status !== "approved") {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Invalid OTP"
      });
    }
    // const user = await User.findOneAndUpdate(
    //   { "personalProfile.phone": phoneNumber },
    //   { $set: { "personalProfile.isVerified": true } },
    //   { new: true }
    // );

    // if (!user) {
    //   return res.status(404).json({
    //     message: "User not found"
    //   });
    // }


    return res.status(200).json({
      success: true,
      verified: true,
      message: "Phone number verified successfully"
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
})

router.put("/change-password", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }


    await changeUserPassword(req.user!.userId, newPassword);

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal server error" });
  }
});

const changeUserPassword = async (
  userId: Types.ObjectId,
  newPassword: string
): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Prevent reusing same password
  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) {
    const error: any = new Error("New password must be different from current password");
    error.statusCode = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};

export default router;