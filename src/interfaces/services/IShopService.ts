import { Character } from "@prisma/client";
import { IncludeUserAndEquipment } from "./ICharacterService";

export default interface IShopService {
    buyEquipment(hash: string, coin: number): Promise<Character & IncludeUserAndEquipment | null>
}