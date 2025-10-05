import config from "../../config";
import { AuthService } from "../../service/auth/AuthService";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";


const createUser = catchAsync(async (req, res) => {
  const { userId, otp } = await AuthService.createUserService(req.body);
  console.log("user otp" , otp);
  
  sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "OTP sent successfully",
        data: {
            userId,
            otp
        },
    });
});

const otpVerify = catchAsync(async (req, res) => {
  const { otp, userId } = req.body;

  const {user, token } = await AuthService.otpVerifyService(userId, otp);

  res.cookie("token", token, {
    httpOnly: true,         
    secure: config.node_env === "production",
    sameSite: "strict",   
    maxAge: 24 * 60 * 60 * 1000, 
  });

  sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User verified successfully",
        data: {
            token,
             user
        } 
    });
});

export const AuthController = {
  createUser,
  otpVerify 
};