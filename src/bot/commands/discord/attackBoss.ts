import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import IGameService from "../../../interfaces/services/IGameService";
import GameService from "../../services/GameService";

class AttackBossCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!player <hash> att boss";
    }

    perform(msg: Message): void {
        let game: IGameService = GameService;
        let playerId = msg.content.split(" ")[1];
        game.attackBossBy(playerId)
        msg.channel.send("บอสโดนจมตีน");
    }
}

export default new AttackBossCommand();