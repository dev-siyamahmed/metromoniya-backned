
import express from 'express';
import { AuthController } from '../../controllers/auth/AuthController';
const router = express.Router()

router.post("/create-user", AuthController.createUser)
router.post("/otp-verify", AuthController.otpVerify)
router.post("/login", AuthController.loginUser)
// router.post("/resend-otp", AuthController.resendOtp)
// router.post("/google/login", AuthController.googleLogin)
// router.post("/facebook/login", AuthController.facebookLogin)

export const AuthRouter = router