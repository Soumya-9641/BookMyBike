import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../../Models/User";
import crypto, { randomBytes } from "crypto";
// ─────────────────────────────────────────────────────────────
// ADMIN REGISTER
// ─────────────────────────────────────────────────────────────
export const adminRegisterService = async ({
  email,
  password,
  firstName,
  lastName,
  phoneNumber
}: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}) => {
  // ── Check duplicate email ──
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    const error: any = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }

  // ── Hash password ──
  const hashedPassword = await bcrypt.hash(password, 12);
 let verificationToken = crypto.randomBytes(32).toString("hex");
  // ── Use new User() + save() to avoid TypeScript overload error with User.create({}) ──
  const user= await User.create({
        email,
        password: hashedPassword,
        emailVerified: false,
        emailVerificationToken: verificationToken,
        systemRole: "admin",
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        personalProfile: {

          firstName,
          lastName,
          isVerified: false,
          phone: phoneNumber
        }
      });
  await user.save();

  return {
    message:    "Admin registered successfully",
    adminId:    user._id,
    email:      user.email,
    systemRole: user.systemRole,
  };
};

// ─────────────────────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────────────────────
export const adminLoginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // ── Find user by email ──
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    const error: any = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // ── Must be admin ──
  if (user.systemRole !== "admin") {
    const error: any = new Error("Access denied: Not an admin account");
    error.statusCode = 403;
    throw error;
  }

  // ── Check if blocked ──
  if (user.isBlocked) {
    const error: any = new Error("This admin account has been blocked");
    error.statusCode = 403;
    throw error;
  }

  // ── Verify password ──
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error: any = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // ── Generate JWT ──
  const token = jwt.sign(
    {
      userId:     user._id.toString(),
      email:      user.email,
      systemRole: user.systemRole,
      name: `${user.personalProfile?.firstName ?? ""} ${user.personalProfile?.lastName ?? ""}`.trim(),
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return {
    message: "Admin login successful",
    token,
    admin: {
      adminId:    user._id,
      email:      user.email,
      systemRole: user.systemRole,
      firstName:  user.personalProfile?.firstName ?? null,
      lastName:   user.personalProfile?.lastName  ?? null,
    },
  };
};