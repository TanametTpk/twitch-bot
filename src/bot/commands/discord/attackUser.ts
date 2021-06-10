import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import IGameService from "../../../interfaces/services/IGameService";
import WebSocketApi from "../../../webserver/socket/api";
import services from "../../services";

class AttackPlayerCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!player [^ ]+ pvp [^ ]+/.test(text);
    }

    perform(msg: Message): void {
        let game: IGameService = services.game;
        let params = msg.content.split(" ");
        let attackerId = params[1];
        let attackedId = params[3];
        game.pvp(attackerId, attackedId);
        msg.channel.send(`player ${attackedId} ถูก ${attackerId} จมตีน`);
        let webUI = WebSocketApi.getInstance()
        webUI.showFeed(`${attackerId} 🗡️ ${attackedId}`, 'topRight', 1.5)
    }
}

export default new AttackPlayerCommand();