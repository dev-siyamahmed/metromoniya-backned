import { AuthService } from "../../service/auth/AuthService";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";


const createUser = catchAsync(async (req, res) => {
  const { userId, otp } = await AuthService.createUserService(req.body);
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

export const AuthController = {
  createUser,
};