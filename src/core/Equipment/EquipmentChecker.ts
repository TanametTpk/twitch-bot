import { Character, Equipment } from "@prisma/client";
import moment from "moment";
import * as services from "../../bot/services";
import ICharacterService, { IncludeUserAndEquipment } from "../../interfaces/services/ICharacterService";
import IEquipmentService from "../../interfaces/services/IEquipmentService";
import Tickable from "../interfaces/Tickable";

export default class EquipmentChecker implements Tickable {
    private characterService: ICharacterService;
    private equipmentService: IEquipmentService;

    constructor() {
        this.characterService = services.character;
        this.equipmentService = services.equipment;
    }

    start(): void {
        this.updateAllPlayerEquipment()
    }

    update(): void {}

    private isShouldUpdate(equipment: Equipment): boolean {
        const isSameDay = moment(equipment.last_time_check).isSame(new Date(), 'days');
        if (isSameDay) return false;
        return true;
    }

    private async updateEquipmentOf(player: Character & IncludeUserAndEquipment) {
        if (!player.equipment) return;

        player.equipment.expired_time -= 1;
        player.equipment.last_time_check = new Date();

        const isExpired = player.equipment.expired_time < 0
        if (isExpired) {
            this.characterService.removeEquipment(player.id);
            return;
        }
        
        await this.equipmentService.updateExpiredEquipment(
            player.equipment.id,
            player.equipment.last_time_check,
            player.equipment.expired_time
        )
    }

    public async updateAllPlayerEquipment() {
        let players = await this.characterService.getAllArmedPlayer();
        let count = players.length;
        for (let i = 0; i < count; i++) {
            let player = players[i]
            
            if (player.equipment && this.isShouldUpdate(player.equipment)) {
                this.updateEquipmentOf(player)
            }
        }
    }
}