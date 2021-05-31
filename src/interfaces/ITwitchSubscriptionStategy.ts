import { Client, SubUserstate } from "tmi.js";

export default interface ITwitchSubscriptionStategy {
    perform(client: Client, channel: string, message: string, username: string, userstate: SubUserstate): void
}