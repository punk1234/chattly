import { Inject, Service } from "typedi";
import { UserService } from "./user.service";
import { RegisterUserDto, User } from "../models";

@Service()
export class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private userService: UserService) {}

  /**
   * @method register
   * @async
   * @param {RegisterUserDto} data
   * @returns {Promise<User>}
   */
  async register(data: RegisterUserDto): Promise<User> {
    await this.userService.checkThatUserWithUsernameOrEmailDoesNotExist(data.username, data.email);

    return this.userService.createUser(data);
  }
}
