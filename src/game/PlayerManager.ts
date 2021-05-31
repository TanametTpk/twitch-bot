import moment from 'moment';
import { Equipment, User, Character } from "@prisma/client";
import ICharacterService, { IncludeUserAndEquipment } from "../interfaces/services/ICharacterService";

export interface Reward {
    chracterId: number
    coin: number
}

export default class PlayerManager {
    private onlinePlayers: Map<string, User>;
    private totalOnlineDamage: number;
    private characterService: ICharacterService;

    constructor(characterService: ICharacterService) {
        this.onlinePlayers = new Map();
        this.totalOnlineDamage = 0;
        this.characterService = characterService;
    }

    public async addOnlinePlayer(user: User) {
        if (this.onlinePlayers.has(user.hash)) return;

        let character = await this.characterService.getCharacterByUserId(user.id);
        
        if (!character) return;

        this.onlinePlayers.set(user.hash, user);
        this.totalOnlineDamage += character.atk;

        if (character.equipment)
            this.totalOnlineDamage += character.equipment.atk;
    }

    public async removeOnlinePlayer(user: User) {
        if (!this.onlinePlayers.has(user.hash)) return;

        let character = await this.characterService.getCharacterByUserId(user.id);
        
        if (!character) return;
        this.onlinePlayers.delete(user.hash);
        this.totalOnlineDamage -= character.atk;

        if (character.equipment)
            this.totalOnlineDamage -= character.equipment.atk;
    }

    private isShouldUpdate(equipment: Equipment): boolean {
        const isSameDay = moment(equipment.last_time_check).isSame(new Date(), 'days');
        if (isSameDay) return false;
        return true;
    }

    private updateEquipmentOf(player: Character & IncludeUserAndEquipment) {
        player.equipment!.expired_time -= 1;
        player.equipment!.last_time_check = new Date();
        
        const isExpired = player.equipment!.expired_time < 0
        if (isExpired) {
            this.characterService.removeEquipment(player.id);
        }
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

    public calculateAttackPowerOf(player: Character & IncludeUserAndEquipment): number {
        let attackPower: number = player.atk;
        if (player.equipment) {
            attackPower += player.equipment.atk
        }

        return attackPower;
    }

    public distributeRewards(rewards: Reward[]): void {
        rewards.map((reward) => {
            this.characterService.addCoinToCharacter(reward.chracterId, reward.coin);
        })
    }

    public getOnlinePlayers(): User[] {
        return Array.from(this.onlinePlayers.values());
    }

    public getTotalOnlineDamage(): number {
        return this.totalOnlineDamage;
    }

    public isPlayerOnline(hash: string): boolean {
        return this.onlinePlayers.has(hash);
    }
}