import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
import services from "../services";

class BuyWeaponCommand extends AbstractChannelPointAction {
    constructor() {
        super("a4f70123-8adf-4b1b-83a0-2add5094336a");
    }

    private isNumber(msg: string): boolean {
        return /^\d+$/.test(msg)
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        if (!tags["user-id"]) return;
        let playerManager = services.game.getGameManager().playerManager
        let character = await services.character.getCharacterByUserHash(tags["user-id"]);
        if (!character) throw new Error("not found character")
        if (playerManager.isPlayerDead(tags["user-id"])) return;

        if (!this.isNumber(message)) {
            client.say(channel, `
                @${tags.username} ใส่ตัวเลยมาดีๆหน่อย เสีย point ฟรีๆ เลยเห็นไหม
            `)
            return;
        }

        let coin: number = Number(message)

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

        if (character.equipment && character.equipment.atk < coin) {
            client.say(channel, `
                @${tags.username} ของใหม่มันกากกว่า ก็อย่าซื้อดีกว่ามั้ง
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