import { Character } from "../database/entity/Character";
import { CharacterEquipment } from "../database/entity/CharacterEquipment";

export default interface ICharacterEquipmentService {
    createEquipment(character: Character, atk: number, expired_time: number): Promise<CharacterEquipment | undefined>
    getEquipment(character_id: number): Promise<CharacterEquipment | undefined>
    removeEquipment(id: number): Promise<void>;
}