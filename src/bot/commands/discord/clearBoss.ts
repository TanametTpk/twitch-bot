import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import services from "../../services";

class ClearBossCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!boss clear";
    }

    perform(msg: Message): void {
        const gameService = services.game
        const boss = gameService.getGameManager().bossManager.getBoss();
        if (!boss) {
            msg.channel.send("boss has not already spawned!")
            return
        }

        gameService.getGameManager().bossManager.clear()
        msg.channel.send(`ลบ boss แล้ว`);
    }
}

export default new ClearBossCommand();