import { Character } from "../../database/entity/Character";
import game from "../../game";
import IShopService from "../../interfaces/services/IShopService";
import CharacterService from "./CharacterService";

class ShopService implements IShopService {
    async buyEquipment(userId: number, coin: number): Promise<Character | undefined> {
        let chracter = await CharacterService.getCharacterByUserId(userId);
        if (!chracter) return;

        await game.buyEquipment(chracter.id, coin);
        return CharacterService.getCharacterByUserId(userId);
    }
}

export default new ShopService();