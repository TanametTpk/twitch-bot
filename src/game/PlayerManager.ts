import moment from 'moment';
import { Equipment, User, Character } from "@prisma/client";
import ICharacterService, { IncludeUserAndEquipment } from "../interfaces/services/ICharacterService";
import IEquipmentService from '../interfaces/services/IEquipmentService';

export interface Reward {
    chracterId: number
    coin: number
}

interface DeadInfo {
    user: User
    last_dead_time: Date
}

export default class PlayerManager {
    private onlinePlayers: Map<string, User>;
    private totalOnlineDamage: number;
    private characterService: ICharacterService;
    private equipmentService: IEquipmentService;
    private deadList: Map<number, DeadInfo>;

    constructor(characterService: ICharacterService, equipmentService: IEquipmentService) {
        this.onlinePlayers = new Map();
        this.deadList = new Map();
        this.totalOnlineDamage = 0;
        this.characterService = characterService;
        this.equipmentService = equipmentService;
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

    public isPlayerDead(userId: number): boolean {
        return this.deadList.has(userId)
    }

    public canAttackPlayer(userId: number): boolean {
        if (!this.isPlayerDead(userId)) return true;
        let deadInfo: DeadInfo = this.deadList.get(userId)!
        
        let lasttime = moment(deadInfo.last_dead_time);
        let now = moment();
        let diffMin = now.diff(lasttime, 'seconds', true);
        let invulnerableTime = Number(process.env.INVULNERABLE_TIME_AFTER_DIE || 180)

        if (diffMin > invulnerableTime) return true;
        return false;
    }
}