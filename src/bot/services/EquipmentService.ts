import { Character, Equipment, PrismaClient } from "@prisma/client";
import IEquipmentService from "../../interfaces/services/IEquipmentService";

class EquipmentService implements IEquipmentService {
    private client: PrismaClient

    constructor(client: PrismaClient) {
        this.client = client;
    }

    public createEquipment(character: Character, atk: number, expired_time: number): Promise<Equipment | null> {
        return this.client.equipment.create({
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
        return this.client.equipment.findFirst({
            where: {id}
        })
    }

    public removeEquipment(id: number): void {
        this.client.equipment.delete({
            where: {id}
        })
    }
}

export default EquipmentService;