
import express from 'express';
import { AuthController } from '../../controllers/auth/AuthController';
const router = express.Router()

router.post("/create-user", AuthController.createUser)
// router.post("/verify-otp", AuthController.verifyOtp)
// router.post("/login", AuthController.login)
// router.post("/resend-otp", AuthController.resendOtp)
// router.post("/google/login", AuthController.googleLogin)
// router.post("/facebook/login", AuthController.facebookLogin)

export const AuthRouter = router