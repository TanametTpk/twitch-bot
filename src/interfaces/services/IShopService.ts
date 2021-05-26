import { Character } from "../../database/entity/Character";

export default interface IShopService {
    buyEquipment(characterId: string, coin: number): Promise<Character | undefined>
}