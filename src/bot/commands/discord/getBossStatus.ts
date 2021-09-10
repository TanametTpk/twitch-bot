import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import * as services from "../../services";

class BossStatusCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!boss status";
    }

    getHelp(): string {
        return "!boss status";
    }

    perform(msg: Message): void {
        const gameService = services.game
        const boss = gameService.getGameManager().bossManager.getBoss();
        if (!boss) {
            msg.channel.send("boss has not already spawned!")
            return
        }
        
        msg.channel.send(`
            --- Boss Status ---
            Level ${boss?.getLevel()}
            Max Hp ${boss?.getMaxHp()}
            Current Hp ${boss?.getHp()}
        `);
    }
}

export default new BossStatusCommand();