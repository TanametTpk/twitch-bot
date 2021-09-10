import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import * as services from "../../services";

class BossAttackCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!boss attack";
    }

    getHelp(): string {
        return "!boss attack";
    }

    perform(msg: Message): void {
        const gameService = services.game
        const boss = gameService.getGameManager().bossManager.getBoss()
        if (!boss) {
            msg.channel.send("boss has not already spawned!")
            return
        }

        gameService.getGameManager().bossManager.getBoss()?.attack();
        msg.channel.send(`boss โจมตีแล้ว`);
    }
}

export default new BossAttackCommand();