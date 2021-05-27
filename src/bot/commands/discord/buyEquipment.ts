import { Message } from "discord.js";
import { Character } from "../../../database/entity/Character";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import IShopService from "../../../interfaces/services/IShopService";
import CharacterService from "../../services/CharacterService";
import ShopService from "../../services/ShopService";

interface Params {
    id: string
    coin: number
}

class BuyEquipmentCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!player buy [^ ]+ \d/.test(text);
    }

    private getParams(msg: string): Params {
        let splitedMsg = msg.split(" ");

        return {
            id: splitedMsg[2],
            coin: Number(splitedMsg[3])
        }
    }

    async perform(msg: Message) {
        let shop: IShopService = ShopService;
        let params: Params = this.getParams(msg.content)
        let character = await CharacterService.getCharacterByUserHash(params.id);

        if (!character) return;

        if (character.coin < params.coin) {
            msg.channel.send("เงินไม่พอโว้ยยย ไปเรียนเลขมาใหม่ไป๊");
            return;
        }
        
        character = await shop.buyEquipment(params.id, params.coin);
        if (!character || !character.equipment) {
            msg.channel.send("ซื้อของไม่ได้ อะไรวะเนี่ย");
            return;
        }

        let totalDmg: number = character.equipment.atk + character.atk;
        let duration: number = character.equipment.expired_time;
        msg.channel.send(`ถอยดาบใหม่ได้แล้วโว้ย!! ตอนนี้ damage รวมกู ${totalDmg} เป็นเวลา ${duration} วัน`);
    }
}

export default new BuyEquipmentCommand();