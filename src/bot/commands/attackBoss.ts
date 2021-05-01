import { Message } from "discord.js";
import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../interfaces/ICommand";
import IMessage from "../../interfaces/IMessage";

export default class AttackBossCommand implements ICommand {
    match(text: string): boolean {
        return text === "!attack boss";
    }

    perform(message: IMessage): void {}

    discordPerform(msg: Message): void {}

    twitchPerform(client: Client, channel: string, tags: ChatUserstate, message: string): void {}
}