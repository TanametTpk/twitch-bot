import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
import PlayerNotFoundError from "../errors/PlayerNotFoundError";
import * as services from "../services";

class SpellAction extends AbstractChannelPointAction {
    constructor() {
        super("8b33e397-d6d8-4501-a0b5-405455c6f15d");
    }

    async perform(client: Client, channel: string, userstate: ChatUserstate, message: string): Promise<void> {
        if (!userstate["user-id"]) return;
        
        let playerManager = services.game.getGameManager().playerManager
        let player = playerManager.getPlayer(userstate["user-id"])
        if (!player) throw new PlayerNotFoundError("can't find player by user id, have something wrong in this system!!")

        let isMatch = services.game.getGameManager().spellManager.isMatchSpell(player, message)
        if (!isMatch) return;

        services.game.getGameManager().spellManager.castSpell(player, message)
    }
}

export default new SpellAction();