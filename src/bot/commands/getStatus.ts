import { Message } from "discord.js";
import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../interfaces/ICommand";
import IMessage from "../../interfaces/IMessage";

export default class GetStatusCommand implements ICommand {
    match(text: string): boolean {
        return text === "!status";
    }

    perform(message: IMessage): void {}

    discordPerform(msg: Message): void {
        msg.channel.send("ดู status");
    }

    twitchPerform(client: Client, channel: string, tags: ChatUserstate, message: string): void {
        client.say(channel, `@${tags.username}, status`)
    }
}