import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import GameManager from '../../../game/index';

class SpawnBossCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!spawn";
    }

    perform(msg: Message): void {
        GameManager.spawnBoss();
        msg.channel.send("spawn boss now!");
    }
}

export default new SpawnBossCommand();