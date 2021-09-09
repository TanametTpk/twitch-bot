import { ChatUserstate, Client } from "tmi.js";

export default interface IChannelPointAction {
    match(customRewardId: string): boolean
    getIsNeedMessage(): boolean
    perform(client: Client, channel: string, userstate: ChatUserstate, message: string): void
}