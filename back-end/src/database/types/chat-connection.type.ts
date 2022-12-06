import { Document } from "mongoose";
import { ChatType } from "../../models";

/**
 * @interface IChatConnection
 */
export interface IChatConnection extends Document {
    _id: string;
    connectOne: string;
    connectTwo: string;
    connectTwoType: ChatType; // TODO: UPDATE API-SPEC to allow FULL-NAMES FOR CHAT KEYS like `SINGLE` instread of `S`
    initiatedAt: Date;
}