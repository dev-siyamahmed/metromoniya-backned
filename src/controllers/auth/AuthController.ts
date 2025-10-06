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

  const {token } = await AuthService.otpVerifyService(userId, otp);

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
        } 
    });
});

const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  const { token } = await AuthService.loginUserService(email, password);  

  res.cookie("token", token, {
    httpOnly: true,         
    secure: config.node_env === "production",
    sameSite: "strict",   
    maxAge: 24 * 60 * 60 * 1000, 
  });

  sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: {
            token
        } 
    });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const { userId, otp } = await AuthService.forgetPasswordService(email);
  sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password reset email sent successfully",
        data: {
            userId,
            otp
        }
    });
});

const verifyResetOtp = catchAsync(async (req, res) => {
  const { userId, otp } = req.body;
  const isVerified = await AuthService.verifyResetOtpService(userId, otp);
  sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "OTP verified successfully",
        data: {
            isVerified
        }
    });
});


const resetPassword = catchAsync(async (req, res) => {
  const { userId, newPassword } = req.body;
  const isReset = await AuthService.resetPasswordService(userId, newPassword);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: {
      isReset
    }
  });
});


export const AuthController = {
  createUser,
  otpVerify,
  loginUser,
  forgetPassword,
  verifyResetOtp,
  resetPassword
};