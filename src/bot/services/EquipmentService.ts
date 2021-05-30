import { Character, Equipment } from "@prisma/client";
import IEquipmentService from "../../interfaces/services/IEquipmentService";

class EquipmentService implements IEquipmentService {
    public createEquipment(character: Character, atk: number, expired_time: number): Promise<Equipment | null> {
        const equipment = new CharacterEquipment();
        equipment.character = character;
        equipment.atk = atk;
        equipment.expired_time = expired_time;
        equipment.last_time_check = new Date();

        return equipment.save();
    }

    public getEquipment(id: number): Promise<Equipment | null> {
        return CharacterEquipment.findOne(id);
    }

    public async removeEquipment(id: number): Promise<void> {
        const equipment = await this.getEquipment(id);
        if (!equipment) return;

        equipment.remove();
    }
}

export default new EquipmentService();