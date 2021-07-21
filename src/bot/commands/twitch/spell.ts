import { text } from "express";
import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import PlayerNotFoundError from "../../errors/PlayerNotFoundError";
import * as services from "../../services";

class SpellCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        return text.startsWith("!spell");
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        message = message.replace("!spell", "");
        if (!tags["user-id"]) return;
        
        let playerManager = services.game.getGameManager().playerManager
        let player = playerManager.getPlayer(tags["user-id"])
        if (!player) throw new PlayerNotFoundError("can't find player by user id, have something wrong in this system!!")

        let isMatch = services.game.getGameManager().spellManager.isMatchSpell(player, message)
        if (!isMatch) return;

        services.game.getGameManager().spellManager.castSpell(player, message)
    }
}

export default new SpellCommand();