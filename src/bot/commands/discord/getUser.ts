import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import CharacterService from "../../services/CharacterService";

class GetUserCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!player status <id>";
    }

    async perform(msg: Message) {
        let playerId = Number(msg.content.split(" ")[2])
        let chracter = await CharacterService.getCharacterByUserId(playerId)
        let isHaveEquipment = chracter?.equipment !== undefined
        let equipmentInfo = "Equipment info "
        if (isHaveEquipment) {
            equipmentInfo += `Atk ${chracter?.equipment?.atk} (ใช้ได้อีก ${chracter?.equipment?.expired_time} วัน)`
        }

        msg.channel.send(`
        --- ${playerId} Status ---
            Max Hp ${chracter?.max_hp}
            Current Hp ${chracter?.hp}
            Base Atk ${chracter?.atk}
            haveEquipment ${chracter?.equipment != undefined}

        `);
    }
}

export default new GetUserCommand();