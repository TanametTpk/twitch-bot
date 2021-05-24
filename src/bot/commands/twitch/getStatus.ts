import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";

export default class GetStatusCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        return text === "!status";
    }

    perform(client: Client, channel: string, tags: ChatUserstate, message: string): void {
        client.say(channel, `@${tags.username}, status`)
    }
}