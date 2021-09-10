import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import * as services from "../../services";

class KillBossCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!boss kill";
    }

    getHelp(): string {
        return "!boss kill - Kills the boss";
    }

    perform(msg: Message): void {
        const gameService = services.game
        const boss = gameService.getGameManager().bossManager.getBoss()
        if (!boss) {
            msg.channel.send("boss has not already spawned!")
            return
        }

        boss.wasAttack(boss.getHp())
        msg.channel.send(`boss ย่อยสลายแล้ว`);
    }
}

export default new KillBossCommand();