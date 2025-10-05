import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';

import mongoose from 'mongoose';

import { TUserRole } from '../interface/UserInterface'; 
import { UserModel } from '../model/UserModel';
import { ROLE } from '../constance/Role';

const userAuth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Token is missing or UnAuthorized Access!!',
      );
    }

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_TOKEN as string,
    ) as JwtPayload;

    if (!decoded) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const { role, userId } = decoded;

    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // checking if the user is exist
    const user = await UserModel.findById(objectIdUserId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'You are not authorized!');
    }
    if (user?.status === "deleted" || user?.status === "blocked") {
      throw new AppError(httpStatus.UNAUTHORIZED, `Access denied! This account is currently ${user.status === "deleted" ? "deleted" : "blocked"}.`);
    }
    
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are  unAuthorized  Person!',
      );
    }

    // req.user = decoded as JwtPayload;
    req.user = { ...decoded, userId: objectIdUserId };
    next();
  });
};

// Aliaes for different roles
const adminAuth = userAuth(ROLE.admin);
const userOnlyAuth = userAuth(ROLE.user);

// Auth Middleware for all authenticated users (admin, user)
const anyAuth = userAuth(ROLE.admin, ROLE.user);

export { userAuth, adminAuth, userOnlyAuth, anyAuth };
