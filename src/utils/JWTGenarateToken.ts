import jwt from "jsonwebtoken";

export const JWTCreateToken = (
  jwtPayload: { userId: string },
  secretKey: string,
  expiresIn: string
): string => {
  return jwt.sign(jwtPayload, secretKey, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
};
