import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import * as services from "../../services";

class GetUserCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!player status [^ ]+/.test(text);
    }

    async perform(msg: Message) {
        let playerId = msg.content.split(" ")[2]
        let character = await services.character.getCharacterByUserHash(playerId)
        let equipmentInfo = ""

        if (!character) {
            msg.channel.send(`ไอ้สันขวาน มึงยังไม่สมัครบัญชี`)
            return;
        }

        if (character.equipment) {
            equipmentInfo += `Atk ${character?.equipment?.atk} (ใช้ได้อีก ${character?.equipment?.expired_time} วัน)`
        }

        msg.channel.send(`
        --- ${playerId} Status ---
            Base Atk ${character?.atk}
            coin ${character.coin}
            haveEquipment ${character?.equipment !== null}
            ${equipmentInfo}
        `);
    }
}

export default new GetUserCommand();