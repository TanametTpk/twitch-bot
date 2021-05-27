import { Message } from "discord.js";
import { Character } from "../../../database/entity/Character";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import IShopService from "../../../interfaces/services/IShopService";
import ShopService from "../../services/ShopService";

interface Params {
    id: string
    coin: number
}

class BuyEquipmentCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!player <id> buy <coin>";
    }

    private getParams(msg: string): Params {
        let splitedMsg = msg.split(" ");

        return {
            id: splitedMsg[1],
            coin: Number(splitedMsg[3])
        }
    }

    async perform(msg: Message) {
        let shop: IShopService = ShopService;
        let params: Params = this.getParams(msg.content)
        let chracter: Character | undefined = await shop.buyEquipment(params.id, params.coin);
        if (!chracter || !chracter.equipment) {
            msg.channel.send("ซื้อของไม่ได้ อะไรวะเนี่ย");
            return;
        }

        let totalDmg: number = chracter.equipment.atk + chracter.atk;
        let duration: number = chracter.equipment.expired_time;
        msg.channel.send(`ถอยดาบใหม่ได้แล้วโว้ย!! ตอนนี้ damage รวมกู ${totalDmg} เป็นเวลา ${duration} วัน`);
    }
}

export default new BuyEquipmentCommand();