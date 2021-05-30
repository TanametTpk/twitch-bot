import { Character, Equipment } from "@prisma/client";
import prisma from "../../database/client";
import IEquipmentService from "../../interfaces/services/IEquipmentService";

class EquipmentService implements IEquipmentService {
    public createEquipment(character: Character, atk: number, expired_time: number): Promise<Equipment | null> {
        return prisma.equipment.create({
            data: {
                atk,
                expired_time,
                last_time_check: new Date(),
                character: {
                    connect: {
                        id: character.id
                    }
                }
            }
        })
    }

    public getEquipment(id: number): Promise<Equipment | null> {
        return prisma.equipment.findFirst({
            where: {id}
        })
    }

    public removeEquipment(id: number): void {
        prisma.equipment.delete({
            where: {id}
        })
    }
}

export default new EquipmentService();