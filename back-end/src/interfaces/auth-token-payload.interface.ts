import { Role } from "../models";

/**
 * @interface IAuthTokenPayload
 */
export interface IAuthTokenPayload {
  userId: string;
  role: Role;
}
