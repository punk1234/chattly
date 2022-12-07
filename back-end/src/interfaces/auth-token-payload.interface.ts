import { Role } from "../models";

/**
 * @interface IAuthTokenPayload
 */
export interface IAuthTokenPayload {
  userId: string;
  username: string;
  role: Role;
}
