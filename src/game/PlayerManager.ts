import { Character } from "../database/entity/Character";
import { CharacterEquipment } from "../database/entity/CharacterEquipment";
import CharacterService from "../bot/services/CharacterService";
import moment from 'moment';

export interface Reward {
    chracterId: number
    coin: number
}

export default class PlayerManager {
    private isShouldUpdate(equipment: CharacterEquipment): boolean {
        const isSameDay = moment(equipment.last_time_check).isSame(new Date(), 'day');
        if (isSameDay) return false;
        return true;
    }

    private updateEquipmentOf(player: Character) {
        if (!player.equipment) return

        player.equipment.expired_time -= 1;
        player.equipment.last_time_check = new Date();

        const isExpired = player.equipment.expired_time < 0
        if (isExpired) {
            CharacterService.removeEquipment(player.id);
        }
    }

    public async updateAllPlayerEquipment() {
        let [players, count] = await CharacterService.getAllArmedPlayer();
        for (let i = 0; i < count; i++) {
            let player = players[i]
            if (player.equipment && this.isShouldUpdate(player.equipment)) {
                this.updateEquipmentOf(player)
            }
        }
    }

    public calculateAttackPowerOf(player: Character): number {
        let attackPower: number = player.atk;
        if (player.equipment) {
            attackPower += player.equipment.atk
        }

        return attackPower;
    }

    public distributeRewards(rewards: Reward[]): void {
        rewards.map((reward) => {
            CharacterService.addCoinToCharacter(reward.chracterId, reward.coin);
        })
    }
}