import { Role } from "../models";
import { verifyAuthToken } from "../helpers";
import { IAuthTokenPayload } from "../interfaces";
import { UnauthorizedError } from "../exceptions";
import { NextFunction, Request, Response } from "express";

/**
 * @function requireAuth
 * @param {Array<Role>} allowedRoles
 * @returns {Function}
 */
export const requireAuth = (allowedRoles?: Array<Role>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authTokenPayload: IAuthTokenPayload = verifyAuthToken(req.headers);

      if (!allowedRoles || allowedRoles.includes(authTokenPayload.role)) {
        req.auth = authTokenPayload;
        return next();
      }

      next(new UnauthorizedError("Access denied!"));
    } catch (err) {
      next(err);
    }
  };
};
