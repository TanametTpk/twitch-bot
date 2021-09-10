import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import * as services from "../../services";

class SpawnBossCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!boss spawn";
    }

    getHelp(): string {
        return "!boss spawn - Spawns a boss";
    }

    perform(msg: Message): void {
        services.game.spawnBoss();
        msg.channel.send("spawn boss now!");
    }
}

export default new SpawnBossCommand();