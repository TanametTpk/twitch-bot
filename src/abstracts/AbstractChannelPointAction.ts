import { ChatUserstate, Client } from "tmi.js";
import IChannelPointAction from "../interfaces/IChannelPointAction";

export default abstract class AbstractChannelPointAction implements IChannelPointAction {
    private id: string;
    private isNeedMessage: boolean;

    constructor(customRewardId: string, isNeedMessage: boolean = true) {
        this.id = customRewardId;
        this.isNeedMessage = isNeedMessage;
    }

    match(customRewardId: string): boolean {
        return this.id === customRewardId;
    }

    getIsNeedMessage(): boolean {
        return this.isNeedMessage;
    }

    abstract perform(client: Client, channel: string, userstate: ChatUserstate, message: string): void
}