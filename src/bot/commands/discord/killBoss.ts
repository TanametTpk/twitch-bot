import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import * as services from "../../services";

class KillBossCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!boss kill";
    }

    perform(msg: Message): void {
        const gameService = services.game
        const boss = gameService.getGameManager().bossManager.getBoss()
        if (!boss) {
            msg.channel.send("boss has not already spawned!")
            return
        }

        gameService.getGameManager().killBoss()
        msg.channel.send(`boss ย่อยสลายแล้ว`);
    }
}

export default new KillBossCommand();