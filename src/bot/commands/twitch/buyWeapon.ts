import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import BuyBadItemError from "../../errors/BuyBadItemError";
import NegativeCoinNumberError from "../../errors/NegativeCoinNumberError";
import NotEnoughCoinError from "../../errors/NotEnoughCoinError";
import * as services from "../../services";

class BuyWeaponCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        return /!buy \d/.test(text);
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
        
        try {
            await services.shop.buyEquipment(tags["user-id"], coin)

            character = await services.character.getCharacterByUserHash(tags["user-id"]);
            if (!character || !character.equipment) return;

            let totalDmg: number = character.equipment.atk + character.atk;
            let duration: number = character.equipment.expired_time;
            client.say(channel, `@${tags.username}: ถอยดาบใหม่ได้แล้วโว้ย!! ตอนนี้ damage รวมกู ${totalDmg} เป็นเวลา ${duration} วัน`);
        } catch (error) {
            if (error instanceof NotEnoughCoinError) {
                client.say(channel, `@${tags.username} เงินไม่พอโว้ยยย ไปเรียนเลขมาใหม่ไป๊`);
            }

            if (error instanceof BuyBadItemError) {
                client.say(channel, `@${tags.username} ของใหม่มันกากกว่า ก็อย่าซื้อดีกว่ามั้ง`);
            }

            if (error instanceof NegativeCoinNumberError) {
                client.say(channel, `@${tags.username} ของฟรีมันไม่มีในโลกโว้ยยยยย`);
            }
        }
    }
}

export default new BuyWeaponCommand();