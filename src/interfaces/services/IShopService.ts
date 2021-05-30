import { Character } from "@prisma/client";

export default interface IShopService {
    buyEquipment(hash: string, coin: number): Promise<Character | null>
}