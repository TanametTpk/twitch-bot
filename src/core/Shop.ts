import { Equipment } from "@prisma/client";
import BuyBadItemError from "../bot/errors/BuyBadItemError";
import NegativeCoinNumberError from "../bot/errors/NegativeCoinNumberError";
import NotEnoughCoinError from "../bot/errors/NotEnoughCoinError";
import NotFoundPotion from "../bot/errors/NotFoundPotion";
import * as services from "../bot/services";
import ICharacterService from "../interfaces/services/ICharacterService";
import IEquipmentService from "../interfaces/services/IEquipmentService";
import tick from "./helpers/tick";
import Player from "./Player/Player";

export default class Shop {
    protected characterService: ICharacterService
    protected equipmentService: IEquipmentService

    constructor() {
        this.characterService = services.character
        this.equipmentService = services.equipment
    }

    public async buyEquipment(player: Player, coin: number): Promise<Player | undefined> {
        if (coin < 0) throw new NegativeCoinNumberError("can't use negative number to buy item");
        if (coin < 1) return;
        if (coin > 20) coin = 20;
        
        if (!this.isHaveEnoughCoin(player, coin)) throw new NotEnoughCoinError();
        
        let oldEquipment = player.getEquipment()
        if (oldEquipment) {
            if (!this.isNewEquipmentBetter(oldEquipment,  coin)) throw new BuyBadItemError("item is worse than you have")
            await this.characterService.removeEquipment(player.getInfo().id);
        }

        let expireDate = Math.ceil(coin / 4)
        let newEquipment = await this.equipmentService.createEquipment(player.getInfo(), coin, expireDate);
        if (!newEquipment) return;

        player.setEquipment(newEquipment)
        
        await this.characterService.removeCoinFromCharacter(player.getInfo().id, coin);
        return player
    }

    public async buyPotion(player: Player, potion: string): Promise<void> {
        if (!this.isHaveEnoughCoin(player, 2)) throw new NotEnoughCoinError();

        if (potion === "ลืมไปก่อน") {
            player.setEffect("forgotness", tick.MINUTE * 5)
            await this.characterService.removeCoinFromCharacter(player.getInfo().id, 2);
            return
        }

        throw new NotFoundPotion(`not found ${potion}`)
    }

    private isNewEquipmentBetter(oldEquipment: Equipment, coin: number): boolean {
        return oldEquipment.atk <= coin
    }

    protected isHaveEnoughCoin(player: Player, requireCoin: number): boolean {
        return player.getCoin() >= requireCoin;
    }
}