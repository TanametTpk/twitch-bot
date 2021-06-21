import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import PlayerNotFoundError from "../../errors/PlayerNotFoundError";
import * as services from "../../services";

class GetStatusCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        return text === "!stat";
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        if (!tags["user-id"]) return;
        
        let playerManager = services.game.getGameManager().playerManager
        let player = playerManager.getPlayer(tags["user-id"])
        if (!player) throw new PlayerNotFoundError("can't find player by user id, have something wrong in this system!!")

        let equipmentInfo = "ไม่มี"
        if (player.getEquipment()) {
            let isLastDay = player.getEquipment()!.expired_time === 0 
            let remainMessage = isLastDay ? "ใช้ได้วันสุดท้ายแล้ว" : `(ใช้ได้อีก ${player.getEquipment()!.expired_time} วัน)`
            equipmentInfo = `Atk ${player.getEquipment()!.atk} ${remainMessage}`
        }

        let effectInfo = player.getEffects().toString()
        client.say(channel, `
            @${tags.username} Status ->
            พลังจมตีน: ${player.getBaseAtk()}
            coin: ${player.getCoin()}
            สถานะ: ${player.isDead() ? "ตาย" + `รอเกิด ${player.getRespawnTime()} วิ` : "ยังคงหายใจ"}
            อาวุธ: ${equipmentInfo}
            effect: ${effectInfo.length < 1 ? "ไม่มี" : effectInfo}
        `)
    }
}

export default new GetStatusCommand();