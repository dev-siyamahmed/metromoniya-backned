import AppError from "../../errors/AppError";
import { UserModel } from "../../model/UserModel";
import httpStatus from "http-status";
import { OtpService } from "../../utils/OtpService";
import { TUser } from "../../interface/UserInterface";

const createUserService = async (body: TUser) => {
  const { email } = body;

  // Check if user exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
  }

  // Create new user
  const newUser = await UserModel.create(body);

  // Generate OTP
  const otp = await OtpService.generateOtp(email);

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

export const AuthService = {
  createUserService,
};
