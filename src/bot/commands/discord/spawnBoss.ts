import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";

export default class SpawnBossCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!spawn";
    }

    perform(msg: Message): void {
        msg.channel.send("spawn boss now!");
    }
}