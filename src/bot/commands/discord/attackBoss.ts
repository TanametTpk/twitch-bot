import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import IGameService from "../../../interfaces/services/IGameService";
import WebSocketApi from "../../../webserver/socket/api";
import * as services from "../../services";

class AttackBossCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!player [^ ]+ atk boss/.test(text);
    }

    getHelp(): string {
        return "!player <name> atk boss";
    }

    perform(msg: Message): void {
        let game: IGameService = services.game;
        let playerId = msg.content.split(" ")[1];
        game.attackBossBy(playerId)
        msg.channel.send("บอสโดนจมตีน");
        let webUI = WebSocketApi.getInstance()
        webUI.showFeed(`${playerId} 🗡️🐲`, 'topRight', 1.5)
    }
}

export default new AttackBossCommand();