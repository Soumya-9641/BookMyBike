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
dotenv.config();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName , phoneNumber} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    let verificationToken = crypto.randomBytes(32).toString("hex");

   const user= await User.create({
      email,
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
      email,
      "Verify your email",
      `<p>Click the link to verify your email:</p>
       <a href="${verifyUrl}">${verifyUrl}</a>`
    );

    res.status(201).json({
      message: "Verification email sent. Please verify your email."
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      emailVerificationToken: token
    });
    console.log(user);

    if (!user) {
      return res.status(400).send("Invalid or expired verification link");
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();
    return res.status(200).send("Email verified successfully");
    //res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (error: any) {
    res.status(500).send("Email verification failed");
  }
});
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in"
      });
    }

    if (user.isBlocked) {
      return res.status(400).json({ message: "Account blocked" });
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
      `<p>Your verification link:</p>
       <a href="${verifyUrl}">${verifyUrl}</a>`
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
      `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
      `
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


router.post("/send-otp",async (req:AuthRequest, res:Response)=>{

    try{

        const {phoneNumber}=req.body;
        if(!phoneNumber){
            return res.status(400).json({message:"Phone number is required"});
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

    }catch(error:any){
      console.log(error);
        res.status(500).json({ message: error.message });
    } 

})  

router.post("/verify-otp",async(req:Request,res:Response)=>{
  try{
    const {phoneNumber,otp}=req.body;

    if(!phoneNumber || !otp){
        return res.status(400).json({message:"Phone number and OTP are required"});
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

  }catch(error:any){
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