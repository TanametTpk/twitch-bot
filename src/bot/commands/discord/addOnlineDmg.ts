import { Message, User } from "discord.js";
import Player from "../../../core/Player/Player";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import IGameService from "../../../interfaces/services/IGameService";
import * as services from "../../services";

class AddOnlineDmg implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!player add-dmg [^ ]+/.test(text);
    }

    async perform(msg: Message) {
        let game: IGameService = services.game;
        let playerId = msg.content.split(" ")[2];
        let character = await services.character.getCharacterByUserHash(playerId)
        if (!character) return;

        game.getGameManager().playerManager.addOnlinePlayer(new Player(character))
        msg.channel.send("เพิ่ม dmg ให้แล้ว");
    }
}

export default new AddOnlineDmg();