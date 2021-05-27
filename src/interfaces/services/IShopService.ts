import { Character } from "../../database/entity/Character";

export default interface IShopService {
    buyEquipment(hash: string, coin: number): Promise<Character | undefined>
}