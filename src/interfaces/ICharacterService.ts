import { Character } from "../database/entity/Character";
import { CharacterEquipment } from "../database/entity/CharacterEquipment";
import { User } from "../database/entity/User";

export default interface ICharacterService {
    createCharacter(user: User): Promise<Character | undefined>
    getCharacterById(id: number): Promise<Character | undefined>
    healCharacter(id: number, heal_power: number): Promise<Character | undefined>
    attackCharacter(id: number, atk_power: number): Promise<Character | undefined>
    addCoinToCharacter(id: number, coin: number): Promise<Character | undefined>
    removeCoinFromCharacter(id: number, coin: number): Promise<Character | undefined>
    updateCharacterStatus(id: number, max_hp: number, atk: number): Promise<Character | undefined>
    getAllArmedPlayer(): Promise<[Character[], number]>
    setEquipment(id: number, equipment: CharacterEquipment): Promise<Character | undefined>
    removeEquipment(id: number): Promise<Character | undefined>
}