import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import services from "../../services";

class BuyWeaponCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        return false;
        // return /!buy \d/.test(text);
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        if (!tags["user-id"]) return;
        let character = await services.character.getCharacterByUserHash(tags["user-id"]);
        if (!character) throw new Error("not found character")

        let coin: number = Number(message.split(" ")[1])

        if (coin === 0) {
            client.say(channel, `
                @${tags.username} ของฟรีมันไม่มีในโลกโว้ยยยยย
            `)
            return
        }

        if (character.coin < coin) {
            client.say(channel, `
                @${tags.username} เงินไม่พอโว้ยยย ไปเรียนเลขมาใหม่ไป๊
            `)
            return
        }
        
        await services.shop.buyEquipment(tags["user-id"], coin)
        character = await services.character.getCharacterByUserHash(tags["user-id"]);
        if (!character || !character.equipment) throw new Error("can't buy item")

        let totalDmg: number = character.equipment.atk + character.atk;
        let duration: number = character.equipment.expired_time;
        client.say(channel, `@${tags.username}: ถอยดาบใหม่ได้แล้วโว้ย!! ตอนนี้ damage รวมกู ${totalDmg} เป็นเวลา ${duration} วัน`);
    }
}

export default new BuyWeaponCommand();