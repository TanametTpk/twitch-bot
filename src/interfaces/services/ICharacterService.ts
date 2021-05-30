import { Equipment } from ".prisma/client";
import { Character } from "@prisma/client";
import { User } from "../../database/entity/User";

export default interface ICharacterService {
    createCharacter(user: User): Promise<Character | null>
    getCharacterById(id: number): Promise<Character | null>
    getCharacterByUserId(id: number): Promise<Character | null>
    getCharacterByUserHash(hash: string): Promise<Character | null>
    healCharacter(id: number, heal_power: number): Promise<Character | null>
    attackCharacter(id: number, atk_power: number): Promise<Character | null>
    addCoinToCharacter(id: number, coin: number): Promise<Character | null>
    removeCoinFromCharacter(id: number, coin: number): Promise<Character | null>
    updateCharacterStatus(id: number, max_hp: number, atk: number): Promise<Character | null>
    getAllArmedPlayer(): Promise<[Character[], number]>
    setEquipment(id: number, equipment: Equipment): Promise<Character | null>
    removeEquipment(id: number): Promise<Character | null>
}