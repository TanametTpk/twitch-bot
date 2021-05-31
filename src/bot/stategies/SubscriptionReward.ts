import { Client, SubUserstate } from "tmi.js";
import ITwitchSubscriptionStategy from "../../interfaces/ITwitchSubscriptionStategy";

class SubscriptionRewardStategy implements ITwitchSubscriptionStategy {
    perform(client: Client, channel: string, message: string, userstate: SubUserstate): void {
        throw new Error("Method not implemented.");
    }
}

export default new SubscriptionRewardStategy()