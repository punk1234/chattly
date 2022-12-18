import C from "../constants";
import config from "../config";
import { JwtHelper } from "../helpers";
import { Inject, Service } from "typedi";
import { UserService } from "./user.service";
import { IAuthTokenPayload } from "../interfaces";
import { IUser } from "../database/types/user.type";
import { UserIdentifier } from "../constants/user-identifier.const";
import { LoginDto, LoginResponse, RegisterUserDto } from "../models";
import { BadRequestError, UnauthenticatedError } from "../exceptions";

@Service()
export class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private readonly userService: UserService) {}

  /**
   * @method register
   * @async
   * @param {RegisterUserDto} data
   * @returns {Promise<IUser>}
   */
  async register(data: RegisterUserDto): Promise<IUser> {
    await this.userService.checkThatUserWithUsernameOrEmailDoesNotExist(data.username, data.email);

    return this.userService.createUser(data);
  }

  /**
   * @method login
   * @async
   * @param {LoginDto} data
   * @returns {Promise<LoginResponse>}
   */
  async login(data: LoginDto): Promise<LoginResponse> {
    const ID_KEY = this.checkThatOnlyOneUserIdIsGivenForLoginAndGetIdKey(data.username, data.email);

    const ID_VALUE = data[ID_KEY as "username" | "password"] as string;
    const USER = await this.checkThatUserExistByIdentifierForLogin(ID_KEY, ID_VALUE);

    this.userService.checkThatUserIsActive(USER);
    this.userService.checkThatPasswordsMatch(data.password, USER.password as string);

    const AUTH_TOKEN_PAYLOAD = this.generateUserAuthTokenPayload(USER);
    const AUTH_TOKEN = JwtHelper.generateToken(AUTH_TOKEN_PAYLOAD, config.AUTH_TOKEN_TTL_IN_HOURS);

    await this.userService.updateLastLoginAt(USER);

    USER.password = undefined;

    return {
      user: USER,
      token: AUTH_TOKEN,
    } as LoginResponse;
  }

  /**
   * @method logout
   * @async
   * @param {string} userId
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logout(userId: string): Promise<void> {
    // NOTE: TO BE IMPLEMENTED LATER (SESSIONS WILL NEED TO BE MANAGED FOR THIS)
    // USER SESSION WILL GET DESTROYED
  }

  /**
   * @method checkThatOnlyOneUserIdIsGivenForLoginAndGetIdKey
   * @instance
   * @param {string} username
   * @param {string} email
   * @returns {UserIdentifier}
   */
  private checkThatOnlyOneUserIdIsGivenForLoginAndGetIdKey(
    username?: string,
    email?: string,
  ): UserIdentifier {
    if (username !== undefined && email !== undefined) {
      throw new BadRequestError("Only one of `username` and `email` should be provided!");
    }

    if (username) {
      return C.UserIdentifier.USERNAME;
    } else if (email) {
      return C.UserIdentifier.EMAIL;
    }

    throw new BadRequestError("One of `username` and `email` should be provided!");
  }

  /**
   * @method generateUserAuthTokenPayload
   * @instance
   * @param {IUser} user
   * @returns {IAuthTokenPayload}
   */
  private generateUserAuthTokenPayload(user: IUser): IAuthTokenPayload {
    return {
      userId: user._id,
      username: user.username,
      role: user.role,
    };
  }

  /**
   * @method checkThatUserExistByIdentifierForLogin
   * @async
   * @param {string} identifierKey
   * @param {string} value
   * @returns {Promise<IUser>}
   */
  private async checkThatUserExistByIdentifierForLogin(
    idKey: string,
    value: string,
  ): Promise<IUser> {
    const foundUser = await this.userService.getUserByIdentifier(idKey, value);

    if (foundUser) {
      return foundUser;
    }

    throw new UnauthenticatedError(C.ResponseMessage.ERR_INVALID_CREDENTIALS);
  }
}
