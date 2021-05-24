import { Character } from "../../database/entity/Character";
import { CharacterEquipment } from "../../database/entity/CharacterEquipment";
import ICharacterEquipmentService from "../../interfaces/ICharacterEquipmentService";

export default class EquipmentService implements ICharacterEquipmentService {
    public createEquipment(character: Character, atk: number, expired_time: number): Promise<CharacterEquipment | undefined> {
        const equipment = new CharacterEquipment();
        equipment.character = character;
        equipment.atk = atk;
        equipment.expired_time = expired_time;
        equipment.last_time_check = new Date();

        return equipment.save();
    }

    public getEquipment(id: number): Promise<CharacterEquipment | undefined> {
        return CharacterEquipment.findOne(id);
    }

    public async removeEquipment(id: number): Promise<void> {
        const equipment = await this.getEquipment(id);
        if (!equipment) return;

        equipment.remove();
    }
}