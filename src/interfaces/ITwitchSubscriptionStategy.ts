import { Client, SubUserstate } from "tmi.js";

export default interface ITwitchSubscriptionStategy {
    perform(client: Client, channel: string, message: string, userstate: SubUserstate): void
}