import { Character, User, Equipment } from "@prisma/client";

export type IncludeUserAndEquipment = {
    user: User;
    equipment: Equipment | null;
}

export default interface ICharacterService {
    createCharacter(user: User): Promise<Character | null>
    getCharacterById(id: number): Promise<(Character & IncludeUserAndEquipment) | null>
    getCharacterByUserId(id: number): Promise<(Character & IncludeUserAndEquipment) | null>
    getCharacterByUserHash(hash: string): Promise<(Character & IncludeUserAndEquipment) | null>
    getCharacterByName(name: string): Promise<(Character & IncludeUserAndEquipment) | null>
    addCoinToCharacter(id: number, coin: number): Promise<Character | null>
    addCoinToAllCharacter(coin: number): void
    removeCoinFromCharacter(id: number, coin: number): Promise<Character | null>
    updateCharacterStatus(id: number, atk: number): Promise<Character | null>
    removeEquipment(id: number): Promise<Character | null>
    getAllArmedPlayer(): Promise<(Character & IncludeUserAndEquipment)[]>
}