import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import IGameService from "../../../interfaces/services/IGameService";
import GameService from "../../services/GameService";

class AttackPlayerCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!player <attackerId> pvp <attackedId>";
    }

    perform(msg: Message): void {
        let game: IGameService = GameService;
        let params = msg.content.split(" ");
        let attackerId = Number(params[1]);
        let attackedId = Number(params[3]);
        game.pvp(attackerId, attackedId);
        msg.channel.send(`player ${attackerId} ถูก ${attackedId} จมตีน`);
    }
}

export default new AttackPlayerCommand();