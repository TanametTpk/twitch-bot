import { ChatUserstate, Client } from "tmi.js";

export default interface ITwitchCheerStategy {
    perform(client: Client, channel: string, userstate: ChatUserstate, message: string): void
}