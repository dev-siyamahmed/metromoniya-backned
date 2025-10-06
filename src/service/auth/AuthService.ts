import AppError from "../../errors/AppError";
import { UserModel } from "../../model/UserModel";
import httpStatus from "http-status";
import { OtpService } from "../../utils/OtpService";
import { TUser } from "../../interface/UserInterface";
import { JWTCreateToken } from "../../utils/JWTGenarateToken";
import config from "../../config";
import bcrypt from 'bcrypt';

const createUserService = async (body: TUser) => {
  const { email } = body;
  // Check if user exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
  }

  // Create new user
  const newUser = await UserModel.create(body);
console.log("newUser ", newUser);

  // Generate OTP
  const otp = await OtpService.generateOtp(newUser._id as string, newUser.email as string);

  console.log("otp" , otp);
  

  // Delete unverified user after 1 minute if not verified
  setTimeout(async () => {
    try {
      const user = await UserModel.findById(newUser._id);
      if (user && !user.verified) {
        await UserModel.deleteOne({ _id: newUser._id });
        console.log(`User ${newUser._id} deleted due to OTP verification failure.`);
      }
    } catch (err) {
      console.error("Error in cleanup timeout:", err);
    }
  }, 2 * 60 * 1000);

  return { userId: newUser._id, otp };
}

const otpVerifyService = async (userId: string, otp: number) => {

  const user = await UserModel.findById(userId);
  console.log("user ", user);
  
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }  

  if (user.verified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already verified");
  }

  const isOtpValid = await OtpService.verifyOtp(userId, otp.toString());
  if (!isOtpValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid OTP or Expired");
  }

  user.verified = true;
  await user.save();

  const jwtPayload = {
        userId: user._id as string,
    };

    // Using createToken with only userId (role will be checked from DB)
    const token = JWTCreateToken(
        jwtPayload,
        config.jwt_access_secret_key as string,
        config.jwt_access_expires_in as string,
    );
    return {user, token };
}

const loginUserService = async (email: string, password: string) => {
   const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  // const isPasswordValid = await user.validatePassword(password);
  const isPasswordValid = await bcrypt.compare(password, user.password as string);
  
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  if (!user.verified) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not verified");
  }
  if (user?.status === "deleted" || user?.status === "blocked") {
        throw new AppError(httpStatus.UNAUTHORIZED, `Access denied! This account is currently ${user.status === "deleted" ? "deleted" : "blocked"}.`);  
    } 

  const jwtPayload = {
        userId: user._id as string,
    };

    // Using createToken with only userId (role will be checked from DB)
    const token = JWTCreateToken(
        jwtPayload,
        config.jwt_access_secret_key as string,
        config.jwt_access_expires_in as string,
    );
    return {user, token };
}

export const AuthService = {
  createUserService,
  otpVerifyService,
  loginUserService
};
