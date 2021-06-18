import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import services from "../../services";

class GetStatusCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        return text === "!stat";
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        if (!tags["user-id"]) return;

        let playerManager = services.game.getGameManager().playerManager
        let character = await services.character.getCharacterByUserHash(tags["user-id"])
        if (!character) throw new Error("can't find character, have something wrong in this system!!")

        let equipmentInfo = "ไม่มี"
        let isDead = playerManager.isPlayerDead(tags["user-id"])
        let altRespawnText = ""

        if (isDead) {
            let remain = playerManager.getRemainRespawnTime(character.user.hash)
            altRespawnText = `รอเกิดอีก ${remain} วินาที`
        }

        if (character.equipment) {
            let isLastDay = character?.equipment?.expired_time === 0 
            let remainMessage = isLastDay ? "ใช้ได้วันสุดท้ายแล้ว" : `(ใช้ได้อีก ${character?.equipment?.expired_time} วัน)`
            equipmentInfo = `Atk ${character?.equipment?.atk} ${remainMessage}`
        }

        client.say(channel, `
            @${tags.username} Status ->
            พลังจมตีน: ${character?.atk}
            coin: ${character.coin}
            สถานะ: ${isDead ? "ตาย" : "ยังคงหายใจ"} ${altRespawnText}
            อาวุธ: ${equipmentInfo}
        `)
    }
}

export default new GetStatusCommand();