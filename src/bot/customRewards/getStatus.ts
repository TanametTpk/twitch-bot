import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
import services from "../services";

class GetStatusCommand extends AbstractChannelPointAction {
    constructor() {
        super("2d7efc80-44f1-4ca0-ba01-b1c399151674");
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        if (!tags["user-id"]) return;

        let character = await services.character.getCharacterByUserHash(tags["user-id"])
        if (!character) throw new Error("can't find character, have something wrong in this system!!")
        let playerManager = services.game.getGameManager().playerManager

        let equipmentInfo = "ไม่มี"
        let isDead = playerManager.isPlayerDead(tags["user-id"])

        if (character.equipment) {
            let isLastDay = character?.equipment?.expired_time === 0 
            let remainMessage = isLastDay ? "ใช้ได้วันสุดท้ายแล้ว" : `(ใช้ได้อีก ${character?.equipment?.expired_time} วัน)`
            equipmentInfo = `Atk ${character?.equipment?.atk} ${remainMessage}`
        }

        client.say(channel, `
            @${tags.username} Status ->
            พลังจมตีน: ${character?.atk}
            coin: ${character.coin}
            สถานะ: ${isDead ? "ตาย" : "ยังคงหายใจ"}
            อาวุธ: ${equipmentInfo}
        `)
    }
}

export default new GetStatusCommand();
