import { User } from "../models";

/**
 * @interface IUser
 */
export interface IUser extends User {
  password?: string;
}