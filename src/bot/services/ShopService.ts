import { Character } from "../../database/entity/Character";
import IShopService from "../../interfaces/services/IShopService";

class ShopService implements IShopService {
    buyEquipment(characterId: string, coin: number): Promise<Character | undefined> {
        throw new Error("Method not implemented.");
    }
}

export default new ShopService();