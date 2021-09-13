import { character } from "../../bot/services";

import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
import PlayerNotFoundError from "../errors/PlayerNotFoundError";
import * as services from "../services";

class ReManaPotion extends AbstractChannelPointAction {
    private sideEffectName: string = "หมดแรงจากการใช้เวทย์ระเบิด"

    constructor() {
        super("5cf25008-228b-4287-9d47-db87b6894518", false);
    }

    async perform(client: Client, channel: string, userstate: ChatUserstate, message: string): Promise<void> {
        if (!userstate["user-id"]) return;
        
        let playerManager = services.game.getGameManager().playerManager
        let player = playerManager.getPlayer(userstate["user-id"])
        if (!player) throw new PlayerNotFoundError("can't find player by user id, have something wrong in this system!!")

        let usageCoin = Number(process.env.RESET_EXPLOSION_COIN_USAGE) || 10
        if (player.getCoin() < usageCoin) return;

        await character.removeCoinFromCharacter(player.getInfo().id, usageCoin)
        player.removeEffect(this.sideEffectName)

        client.say(process.env.tmi_channel_name as string, `@${player.getUser().name} กลับมาสร้างความวิบัดติได้อีกครั้ง!!!`)
    }
}

export default new ReManaPotion();