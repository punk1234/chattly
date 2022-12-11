import C from "../constants";
import { Service } from "typedi";
import { PasswordHasher } from "../helpers";
import { RegisterUserDto } from "../models";
import { IUser } from "../database/types/user.type";
import UserModel from "../database/models/user.model";
import {
  ConflictError,
  NotFoundError,
  UnauthenticatedError,
  UnprocessableError,
} from "../exceptions";

@Service()
export class UserService {
  /**
   * @method createUser
   * @async
   * @param {RegisterUserDto} data
   * @returns {Promise<IUser>}
   */
  async createUser(data: RegisterUserDto): Promise<IUser> {
    const PASSWORD_HASH: string = PasswordHasher.hash(data.password);

    const USER = new UserModel({
      ...data,
      password: PASSWORD_HASH,
      chatDisplayName: data.username,
    });

    return USER.save();
  }

  /**
   * @method getUser
   * @async
   * @param {string} userId
   * @returns {Promise<IUser>}
   */
  async getUser(userId: string): Promise<IUser> {
    const USER = await this.checkThatUserExistByIdentifier(C.UserIdentifier.ID, userId);

    USER.password = undefined;
    return USER;
  }

  /**
   * @method checkThatUserWithUsernameOrEmailDoesNotExist
   * @async
   * @param {string} username
   * @param {string} email
   */
  async checkThatUserWithUsernameOrEmailDoesNotExist(
    username: string,
    email: string,
  ): Promise<void> {
    const foundUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (foundUser) {
      throw new ConflictError("User already exist!");
    }
  }

  /**
   * @method getUserByIdentifier
   * @async
   * @param {string} identifierKey
   * @param {string} value
   * @returns {Promise<IUser>}
   */
  async getUserByIdentifier(identifierKey: string, value: string): Promise<IUser | null> {
    return UserModel.findOne({ [identifierKey]: value });
  }

  /**
   * @method checkThatUserExistByIdentifier
   * @async
   * @param {string} identifierKey
   * @param {string} value
   * @returns {Promise<IUser>}
   */
  async checkThatUserExistByIdentifier(identifierKey: string, value: string): Promise<IUser> {
    const foundUser = await UserModel.findOne({ [identifierKey]: value });

    if (foundUser) {
      return foundUser;
    }

    throw new NotFoundError("User not found!");
  }

  /**
   * @method checkThatUserIsActive
   * @instance
   * @param {IUser} user
   */
  checkThatUserIsActive(user: IUser): void {
    if (!user.active) {
      throw new UnprocessableError("User account has been disabled!");
    }
  }

  /**
   * @method checkThatPasswordsMatch
   * @instance
   * @param {string} plainTextPassword
   * @param {string} passwordHash
   */
  checkThatPasswordsMatch(plainTextPassword: string, passwordHash: string): void {
    const VALID_PASSWORD = PasswordHasher.verify(plainTextPassword, passwordHash);

    if (!VALID_PASSWORD) {
      throw new UnauthenticatedError(C.ResponseMessage.ERR_INVALID_CREDENTIALS);
    }
  }

  /**
   * @method checkThatUsernamesExists
   * @async
   * @param {Array<string>} usernames
   */
  async checkThatUsernamesExists(usernames: Array<string>): Promise<void> {
    // NOTE: IS THERE A NEED TO REMOVE `__v` SUCH THAT ONLY INDEX IS USED FOR THIS CALCULATION
    const USERS = await UserModel.find({ username: { $in: usernames } }).select("username -_id");

    if (USERS.length !== usernames.length) {
      throw new NotFoundError("One or more username(s) does not exist!");
    }
  }

  /**
   * @method updateLastLoginAt
   * @async
   * @param {IUser} user
   * @returns {IUser}
   */
  async updateLastLoginAt(user: IUser): Promise<IUser> {
    user.lastLoginAt = new Date();

    return user.save();
  }
}
