import { Message } from "discord.js";
import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../interfaces/ICommand";
import IMessage from "../../interfaces/IMessage";

export default class SpawnBossCommand implements ICommand {
    match(text: string): boolean {
        return text === "!spawn";
    }

    perform(message: IMessage): void {}

    discordPerform(msg: Message): void {
        msg.channel.send("spawn boss now!");
    }

    twitchPerform(client: Client, channel: string, tags: ChatUserstate, message: string): void {}
}