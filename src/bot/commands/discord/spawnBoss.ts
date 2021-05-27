import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import GameService from "../../services/GameService";

class SpawnBossCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!boss spawn";
    }

    perform(msg: Message): void {
        GameService.spawnBoss();
        msg.channel.send("spawn boss now!");
    }
}

export default new SpawnBossCommand();