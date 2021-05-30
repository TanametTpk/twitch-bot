import { Equipment } from ".prisma/client";
import { Character } from "@prisma/client";


export default interface ICharacterEquipmentService {
    createEquipment(character: Character, atk: number, expired_time: number): Promise<Equipment | null>
    getEquipment(character_id: number): Promise<Equipment | null>
    removeEquipment(id: number): void;
}