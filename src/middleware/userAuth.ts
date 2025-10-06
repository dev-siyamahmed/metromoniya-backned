import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import mongoose from "mongoose";
import { TUserRole } from "../interface/UserInterface";
import { UserModel } from "../model/UserModel";
import { ROLE } from "../constance/Role";
import config from "../config";

const userAuth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // ✅ Token check (either from Bearer header OR cookie)
    const bearerToken = req.headers.authorization?.split(" ")[1];
    const cookieToken = req.cookies?.token;
    const token = bearerToken || cookieToken;

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Token missing or unauthorized access!"
      );
    }

    // ✅ Verify token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret_key as string
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token!");
    }

    if (!decoded?.userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token payload!");
    }

    const { role, userId } = decoded;

    // ✅ Convert string ID to ObjectId safely
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // ✅ Check user existence
    const user = await UserModel.findById(objectIdUserId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

 if (user.passwordChangedAt) {
    if (decoded.iat && decoded.iat < user.passwordChangedAt.getTime()) {
      throw new Error("Token invalidated. Please login again.");
    }
  }
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // ✅ Check account status
    if (user.status === "deleted" || user.status === "blocked") {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        `Access denied! This account is currently ${
          user.status === "deleted" ? "deleted" : "blocked"
        }.`
      );
    }

    // ✅ Role authorization check
    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }

    // ✅ Attach user info to request (safe format)
    req.user = { ...decoded, userId: objectIdUserId };

    next();
  });
};

// ✅ Role-based access
const adminAuth = userAuth(ROLE.admin);
const userOnlyAuth = userAuth(ROLE.user);

// ✅ Auth for any logged-in user (admin or user)
const anyAuth = userAuth(ROLE.admin, ROLE.user);

export { userAuth, adminAuth, userOnlyAuth, anyAuth };
