import { Client, ChatUserstate } from "tmi.js";
import IMiddleware from "../../interfaces/IMiddleware";

class DebugCustomRewardMiddleware implements IMiddleware {
    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        if (process.env.DEGUG_CUSTOM_REWARD !== "true") return;
        if (tags["custom-reward-id"]) {
            console.log("custom reward id:", tags["custom-reward-id"]);
        }
    }
}

export default new DebugCustomRewardMiddleware();