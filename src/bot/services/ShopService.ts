import { Character } from "../../database/entity/Character";
import game from "../../game";
import IShopService from "../../interfaces/services/IShopService";
import CharacterService from "./CharacterService";

class ShopService implements IShopService {
    async buyEquipment(hash: string, coin: number): Promise<Character | undefined> {
        let chracter = await CharacterService.getCharacterByUserHash(hash);
        if (!chracter) return;

        await game.buyEquipment(chracter.id, coin);
        return CharacterService.getCharacterByUserHash(hash);
    }
}

export default new ShopService();