import C from "../constants";
import { Inject, Service } from "typedi";
import { ChatType, CreateGroupChatDto } from "../models";
import GroupChatModel from "../database/models/group-chat.model";
import { BadRequestError, ConflictError, UnprocessableError } from "../exceptions";
import { IGroupChat } from "../database/types/group-chat.type";
import { UserService } from "./user.service";
import { ChatService } from "./chat.service";
import { ChatMessageService } from "./chat-message.service";

@Service()
export class ChatGroupService {

  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly chatService: ChatService,
    @Inject() private readonly chatMessageService: ChatMessageService
  ) {}

  async create(
    userId: string,
    data: CreateGroupChatDto
  ): Promise<IGroupChat> {
    data.name = data.name.trim();

    if(!data.name) {
      throw new BadRequestError("Invalid group-chat name!");
    }

    await this.checkThatGroupChatDoesNotExist(data.name);

    // USE DB TRANSACTION
    const GROUP_CHAT = await new GroupChatModel({
      ...data,
      createdBy: userId
    }).save();

    // GET USER `username` FROM AUTH-PAYLOAD & USE HERE AS `creatorUsername`
    await this.addGroupChatMembers(GROUP_CHAT._id, data.members, "", true);

    // TODO: HANDLE CHAT-GROUP-IMAGE UPLOAD

    await this.chatMessageService.saveChatMessage(
      userId,
      GROUP_CHAT._id,
      ChatType.G,
      "HI EVERYONE & WELCOME!!!"
    );

    return GROUP_CHAT;
  }

  private async checkThatGroupChatDoesNotExist(name: string): Promise<void> {
    // NOTE: SAVE GROUP-CHAT NAME THE WAY THEY ARE WITHOUT ALTERING CASE,
    // BUT CHECK FOR UNIQUENESS OF TEXT IGNORING CASES WHILE CREATING i.e BOTH `Abc` & `ABC` CANNOT CO-EXIST
    const GROUP_CHAT = await GroupChatModel.findOne({ name });

    if(GROUP_CHAT) {
      throw new ConflictError(`Group chat with name '${name}' already exist!`);
    }
  }

  private async addGroupChatMembers(groupChatId: string, membersUsernames: Array<string>, creatorUsername: string, newGroupChat: boolean): Promise<void> {
    // NEED TO CHANGE IMPLEMENTATION OF `connection collection` TO ACCEPT `usernames` & NOT `id`
    // [OPTIONAL FOR LATER] CAN CONFIGURE MAX. MEMBER IN A GROUP-CHAT IN CONFIG

    // CHECK THAT CREATOR `username` IS NOT IN MEMBERS-USERNAMES
    if(membersUsernames.includes(creatorUsername) && !newGroupChat) {
      throw new UnprocessableError("Creator `username` should not exist in members-usernames!");
    }

    await this.userService.checkThatUsernamesExists(membersUsernames);

    // NOTE: CAN USE `Partial<...>` FOR THE RETURN TYPE HERE
    const ALREADY_GROUP_MEMBERS = await this.chatService.getGroupChatConnections(groupChatId, membersUsernames);

    if(ALREADY_GROUP_MEMBERS.length > 0) {
      throw new ConflictError(`${ALREADY_GROUP_MEMBERS.length} user(s) are already members!`);
    }

    await this.chatService.bulkAddGroupChatMembers(groupChatId, membersUsernames);
  }

}
