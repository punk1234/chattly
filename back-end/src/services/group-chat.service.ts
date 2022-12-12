import { Inject, Service } from "typedi";
import { UserService } from "./user.service";
import { ChatMessageService } from "./chat-message.service";
import { IGroupChat } from "../database/types/group-chat.type";
import GroupChatModel from "../database/models/group-chat.model";
import { ChatType, CreateGroupChatDto, UpdateGroupChatDto } from "../models";
import { BadRequestError, ConflictError, NotFoundError, UnprocessableError } from "../exceptions";
import { ChatConnectionService } from "./chat-connection.service";
import { UserIdentifier } from "../constants/user-identifier.const";

@Service()
export class GroupChatService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly chatMessageService: ChatMessageService,
    @Inject() private readonly chatConnectionService: ChatConnectionService,
  ) {}

  /**
   * @method create
   * @async
   * @param {string} userId
   * @param {CreateGroupChatDto} data
   * @returns {Promise<IGroupChat>}
   */
  async create(userId: string, data: CreateGroupChatDto): Promise<IGroupChat> {
    if (!(data.name = data.name.trim())) {
      throw new BadRequestError("Invalid group-chat name!");
    }

    const USER = await this.userService.checkThatUserExistByIdentifier(UserIdentifier.ID, userId);
    await this.checkThatGroupChatDoesNotExist(data.name);

    // USE DB TRANSACTION
    const GROUP_CHAT = await new GroupChatModel({
      ...data,
      createdBy: userId,
    }).save();

    // TODO: HANDLE CHAT-GROUP-IMAGE UPLOAD

    await this.addGroupChatMembers(GROUP_CHAT._id, data.members, USER.username, true);

    const CHAT_MESSAGE = await this.chatMessageService.saveChatMessage(
      userId,
      GROUP_CHAT._id,
      ChatType.G,
      data.initialChatMessage || "HI EVERYONE & WELCOME!!!",
    );

    await this.updateChatLastMessageAt(GROUP_CHAT._id, CHAT_MESSAGE.createdAt);

    return GROUP_CHAT;
  }

  /**
   * @method update
   * @async
   * @param {string} userId
   * @param {UpdateGroupChatDto} data
   * @returns {Promise<IGroupChat>}
   */
  async update(
    groupChatId: string,
    data: UpdateGroupChatDto,
    actorId: string,
  ): Promise<IGroupChat> {
    if (data.name !== undefined && (data.name = data.name?.trim())) {
      throw new BadRequestError("Invalid group-chat name!");
    }

    const GROUP_CHAT = await this.checkThatGroupChatExist(groupChatId);
    // CHECK THAT NEW NAME DOES NOT EXIST IF GIVEN

    // CHECK THAT ONLY OWNER CAN UPDATE GROUP-CHAT
    if (GROUP_CHAT.createdBy !== actorId) {
      throw new UnprocessableError("Only owner can modify GROUP-CHAT details!");
    }

    data.name && (GROUP_CHAT.name = data.name);
    data.description && (GROUP_CHAT.description = data.description);

    if (data.image) {
      // TODO: HANDLE CHAT-GROUP-IMAGE UPLOAD
      // UPDATE GROUP-CHAT IMAGE
    }

    return GROUP_CHAT.save();
  }

  /**
   * @method checkThatGroupChatDoesNotExist
   * @async
   * @param {string} name
   */
  private async checkThatGroupChatDoesNotExist(name: string): Promise<void> {
    // NOTE: SAVE GROUP-CHAT NAME THE WAY THEY ARE WITHOUT ALTERING CASE,
    // BUT CHECK FOR UNIQUENESS OF TEXT IGNORING CASES WHILE CREATING i.e BOTH `Abc` & `ABC` CANNOT CO-EXIST
    const GROUP_CHAT = await GroupChatModel.findOne({ name });

    if (GROUP_CHAT) {
      throw new ConflictError(`Group chat with name '${name}' already exist!`);
    }
  }

  /**
   * @method checkThatGroupChatExist
   * @async
   * @param {string} groupChatId
   * @returns {Promise<IGroupChat>}
   */
  private async checkThatGroupChatExist(groupChatId: string): Promise<IGroupChat> {
    const GROUP_CHAT = await GroupChatModel.findById(groupChatId);

    if (GROUP_CHAT) {
      return GROUP_CHAT;
    }

    throw new NotFoundError(`Group chat does not exist!`);
  }

  /**
   * @method addGroupChatMembers
   * @async
   * @param {string} groupChatId
   * @param {Array<string>} membersUsernames
   * @param {string} creatorUsername
   * @param {boolean} newGroupChat
   */
  private async addGroupChatMembers(
    groupChatId: string,
    membersUsernames: Array<string>,
    creatorUsername: string,
    newGroupChat: boolean,
  ): Promise<void> {
    // NEED TO CHANGE IMPLEMENTATION OF `connection collection` TO ACCEPT `usernames` & NOT `id`
    // [OPTIONAL FOR LATER] CAN CONFIGURE MAX. MEMBER IN A GROUP-CHAT IN CONFIG

    // CHECK THAT CREATOR `username` IS NOT IN MEMBERS-USERNAMES
    // if (membersUsernames.includes(creatorUsername) && !newGroupChat) {
    //   throw new UnprocessableError("Creator `username` should not exist in members-usernames!");
    // }

    const IS_CREATOR_IN_MEMBERS_USERNAMES = membersUsernames.includes(creatorUsername);
    if (IS_CREATOR_IN_MEMBERS_USERNAMES) {
      throw new UnprocessableError("Creator `username` should not exist in members-usernames!");
    }

    await this.userService.checkThatUsernamesExists(membersUsernames);

    if(newGroupChat) {
      membersUsernames.push(creatorUsername);
    }

    // NOTE: CAN USE `Partial<...>` FOR THE RETURN TYPE HERE
    const ALREADY_GROUP_MEMBERS = await this.chatConnectionService.getGroupChatConnections(
      groupChatId,
      membersUsernames,
    );

    if (ALREADY_GROUP_MEMBERS.length > 0) {
      throw new ConflictError(`${ALREADY_GROUP_MEMBERS.length} user(s) are already members!`);
    }

    await this.chatConnectionService.bulkAddChatConnections(groupChatId, membersUsernames);
  }

  async updateChatLastMessageAt(groupChatId: string, lastChatMessageAt: Date): Promise<void> {
    await GroupChatModel.updateOne({ _id: groupChatId }, { lastChatMessageAt });
  }
}
