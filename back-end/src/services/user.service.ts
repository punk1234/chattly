import { Service } from "typedi";
import { IUser } from "../interfaces";
import { PasswordHasher } from "../helpers";
import { RegisterUserDto } from "../models";
import { ConflictError } from "../exceptions";
import UserModel from "../database/models/user.model";

@Service()
export class UserService {

  // eslint-disable-next-line no-useless-constructor
  constructor() {}

  /**
   * @method createUser
   * @async
   * @param {RegisterUserDto} data 
   * @returns {Promise<IUser>}
   */
  async createUser(data: RegisterUserDto): Promise<IUser> {
    const PASSWORD_HASH: string = PasswordHasher.hash(data.password);

    const USER = await new UserModel({
      ...data,
      password: PASSWORD_HASH,
      chatDisplayName: data.username
    }).save();

    delete USER.password;
    return USER;
  }

  /**
   * @method checkThatUserWithUsernameOrEmailDoesNotExist
   * @async
   * @param {string} username 
   * @param {string} email 
   */
  async checkThatUserWithUsernameOrEmailDoesNotExist(username: string, email: string): Promise<void> {
    const foundUser = await UserModel.findOne({
      $or: [{ username }, { email }]
    });

    if(foundUser) {
      throw new ConflictError("User already exist!");
    }
  }

}
