import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import GameManager from '../../../game/index';

class BossStatusCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!boss status";
    }

    perform(msg: Message): void {
        const boss = GameManager.bossManager.getBoss();
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