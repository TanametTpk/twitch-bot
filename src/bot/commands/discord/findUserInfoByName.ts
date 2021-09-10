import { Message } from "discord.js";
import Player from "../../../core/Player/Player";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import * as services from "../../services";

class FindUserByNameCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!info of [^ ]+/.test(text);
    }

    getHelp(): string {
        return "!info of <username>";
    }

    async perform(msg: Message) {
        let username = msg.content.split(" ")[2]
        let character = await services.character.getCharacterByName(username);
        if (!character) return;

        let playerManager = services.game.getGameManager().playerManager
        let player = playerManager.getPlayer(character.user.hash)
        if (!player) {
            player = new Player(character)
        };

        let altRespawnText = ""

        if (player.isDead()) {
            let remain = player.getRespawnTime()
            altRespawnText = `รอเกิดอีก ${remain} วินาที`
        }

        let equipmentInfo = ""
        if (player.getEquipment()) {
            let isLastDay = player.getEquipment()!.expired_time === 0 
            let remainMessage = isLastDay ? "ใช้ได้วันสุดท้ายแล้ว" : `(ใช้ได้อีก ${player.getEquipment()!.expired_time} วัน)`
            equipmentInfo = `Atk ${player.getEquipment()!.atk} ${remainMessage}`
        }

        let effectInfo = player.getEffects().toString()

        msg.channel.send(`
            -- user --
            id: ${character.user.id}
            hash: ${character.user.hash}
            name: ${character.user.name}
            cheer: ${character.user.cheer}
            -- character --
            id: ${character.id}
            coin: ${character.coin}
            base atk: ${character.atk}
            base Atk with buff: ${player.getBaseAtk(true)}
            equipment: ${equipmentInfo}
            isDead: ${player.isDead()} ${altRespawnText}
            effect: ${effectInfo.length < 1 ? "ไม่มี" : effectInfo}
        `);
    }
}

export default new FindUserByNameCommand();