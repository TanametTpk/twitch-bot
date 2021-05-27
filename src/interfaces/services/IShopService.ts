import { Character } from "../../database/entity/Character";

export default interface IShopService {
    buyEquipment(userId: number, coin: number): Promise<Character | undefined>
}