import { Character } from "@prisma/client";
import game from "../../game";
import ICharacterService from "../../interfaces/services/ICharacterService";
import IShopService from "../../interfaces/services/IShopService";
import CharacterService from "./CharacterService";

class ShopService implements IShopService {
    private characterService: ICharacterService = CharacterService;

    async buyEquipment(hash: string, coin: number): Promise<Character | null> {
        let chracter = await this.characterService.getCharacterByUserHash(hash);
        if (!chracter) return null;

        await game.buyEquipment(chracter.id, coin);
        return this.characterService.getCharacterByUserHash(hash);
    }
}

export default new ShopService();