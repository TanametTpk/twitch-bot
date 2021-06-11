import { Character, Equipment } from "@prisma/client";
import ICharacterService, { IncludeUserAndEquipment } from "../interfaces/services/ICharacterService";
import IEquipmentService from "../interfaces/services/IEquipmentService";

export default class Shop {
    constructor(
        protected characterService: ICharacterService,
        protected equipmentService: IEquipmentService
    ) {
        
    }

    public async buyEquipment(chracterId: number, coin: number): Promise<(Character & IncludeUserAndEquipment) | undefined> {
        if (coin < 1) return;
        if (coin > 20) coin = 20;
    
        let character = await this.characterService.getCharacterById(chracterId);
        
        if (!character || !this.isChracterHaveEnoughCoin(character, coin)) return;
        
        if (character.equipment) {
            if (!this.isNewEquipmentBetter(character.equipment, coin)) return
            await this.characterService.removeEquipment(character.id);
        }

        let newEquipment = await this.equipmentService.createEquipment(character, coin, Math.ceil(coin / 4));
        if (!newEquipment) return;
        
        await this.characterService.removeCoinFromCharacter(character.id, coin);
        return character
    }

    private isNewEquipmentBetter(oldEquipment: Equipment, coin: number): boolean {
        return oldEquipment.atk < coin
    }

    protected isChracterHaveEnoughCoin(chracter: Character, requireCoin: number): boolean {
        return chracter.coin >= requireCoin;
    }
}