import { ChatUserstate, Client } from "tmi.js";
import IChannelPointAction from "../interfaces/IChannelPointAction";

export default abstract class AbstractChannelPointAction implements IChannelPointAction {
    private id: string;

    constructor(customRewardId: string) {
        this.id = customRewardId;
    }

    match(customRewardId: string): boolean {
        return this.id === customRewardId;
    }

    abstract perform(client: Client, channel: string, userstate: ChatUserstate, message: string): void
}