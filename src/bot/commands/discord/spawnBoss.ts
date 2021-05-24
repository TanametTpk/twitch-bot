import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";

class SpawnBossCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!spawn";
    }

    perform(msg: Message): void {
        msg.channel.send("spawn boss now!");
    }
}

export default new SpawnBossCommand();