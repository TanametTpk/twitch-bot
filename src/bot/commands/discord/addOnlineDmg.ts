import { Message } from "discord.js";
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
        let user = await services.user.getUserByHash(playerId)

        if (!user) return;

        game.getGameManager().playerManager.addOnlinePlayer(user)
        msg.channel.send("เพิ่ม dmg ให้แล้ว");
    }
}

export default new AddOnlineDmg();