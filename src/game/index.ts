import BossManager from "./BossManager";
import PlayerManager, { Reward } from "./PlayerManager";
import cron from 'node-cron';
import client from '../bot/twitch';
import roll from "../bot/utils/roll";
import sleep from "../bot/utils/sleep";
import moment from 'moment';
import ICharacterService from "../interfaces/services/ICharacterService";
import IEquipmentService from "../interfaces/services/IEquipmentService";
import { Character } from "@prisma/client";
import { setTimeout } from "timers";

class GameManager {
    public bossManager: BossManager;
    public playerManager: PlayerManager;
    public attackPlayerTask: NodeJS.Timer | undefined;
    private bossNextAttackTime: Date | undefined;
    private characterService: ICharacterService;
    private equipmentService: IEquipmentService;

    constructor(characterService: ICharacterService, equipmentService: IEquipmentService) {
        this.bossManager = new BossManager();
        this.playerManager = new PlayerManager(characterService);
        this.characterService = characterService;
        this.equipmentService = equipmentService;

        this.playerManager.updateAllPlayerEquipment()
        this.scheduleEvent()
    }

    private scheduleEvent(): void {
        cron.schedule('0 0 * * * *', () => {
            this.spawnBoss()
        })
    }

    public spawnBoss(): void {
        this.clearBossAttackTask();

        let totalOnlineDamage: number = this.playerManager.getTotalOnlineDamage();
        this.bossManager.spawnBoss(totalOnlineDamage);

        let fiveTeenMinutes: number = 1 * 60 * 1000;
        this.bossNextAttackTime = moment().add(fiveTeenMinutes, 'millisecond').toDate();
        this.attackPlayerTask = setTimeout(() => {
            this.bossAttackRandomPlayer()
        }, fiveTeenMinutes);
    }

    private clearBossAttackTask(): void {
        if (this.attackPlayerTask)
            clearTimeout(this.attackPlayerTask)

        this.bossManager.clear();
    }

    private async randomMutePlayers() {
        let channel_name = process.env.tmi_channel_name as string
        let timeoutSeconds = 180;
        let casualties = 0;
        console.log(`Boss: I am inevitible..`)

        let players = this.playerManager.getOnlinePlayers()
        console.log(players);
        
        for (let player of players) {
            let username = player.name
            if (roll(50)) {
                casualties++;
                console.log(`${username} got attacked.`);
                client.timeout(channel_name, username, timeoutSeconds, `โดนจมตีน`);
                await sleep(620);
            }
        }
        client.say(channel_name, `บอสทำการใช้สกิลตีหมู่ มี ${casualties} คนในแชทได้รับบาดเจ็บ....`);
    }

    private getTopFivePlayer(): number[] {
        let playerIdList = Array.from(this.bossManager.attacker.keys());
        let attackListInfo = Array.from(this.bossManager.attacker.values());
        let damageMapping: Map<number, boolean> = new Map();
        attackListInfo.map((atkInfo) => {
            damageMapping.set(atkInfo.totalDamage, true);
        })

        let topFiveDmg: number[] = Array.from(damageMapping.keys())
                                    .sort((a, b) => b - a)
                                    .slice(0,5);
        
        let topTierPlayerIdList: number[] = []
        for (let i = 0; i < playerIdList.length; i++) {
            const playerId = playerIdList[i];
            let atkInfo = this.bossManager.attacker.get(playerId);
            if (atkInfo && topFiveDmg.includes(atkInfo.totalDamage)) {
                topTierPlayerIdList.push(playerId);
            }
        }

        return topTierPlayerIdList;
    }

    private async bossHasEliminated() {
        let playerIdList: number[] = Array.from(this.bossManager.attacker.keys());
        let topFiveDmgId: number[] = this.getTopFivePlayer();
        let createRewards: Promise<Reward | undefined>[] = playerIdList.map(async(playerId) => {
            let chracter = await this.characterService.getCharacterByUserId(playerId)
            let reward: number = 1;
            if (!chracter) return;
            if (topFiveDmgId.includes(playerId)) reward = 5;

            return {
                chracterId: chracter.id,
                coin: reward
            }
        })

        let rawRewards: (Reward | undefined)[] = await Promise.all(createRewards);
        let rewards: Reward[] = rawRewards.filter(reward => reward) as Reward[]
        this.playerManager.distributeRewards(rewards);

        this.clearBossAttackTask();
        client.say(process.env.tmi_channel_name as string, `บอสถูกกำจัดแล้ว เอารางวัลไปซะเหล่านักพจญภัย`)
    }

    private bossAttackRandomPlayer() {
        if (!this.bossManager.isBossHasSpawned()) return;

        this.clearBossAttackTask();
        this.randomMutePlayers();
    }

    public canBossAttackedBy(character: Character): boolean {
        let info = this.bossManager.attacker.get(character.id);
        if (!info) return true;
        
        let lasttime = moment(info.last_attack_time);
        let now = moment();
        let diffMin = now.diff(lasttime, 'seconds', true);
        return diffMin > 30;
    }

    public async attackBoss(characterId: number) {
        const player = await this.characterService.getCharacterById(characterId);
        if (!player || !this.bossManager.isBossHasSpawned() || !this.canBossAttackedBy(player)) return
        
        let damage: number = this.playerManager.calculateAttackPowerOf(player);
        let boss = this.bossManager.getBoss()
        if (!boss) return;

        boss.wasAttack(damage);
        this.bossManager.rememberAttacker(player.id, damage);

        if (boss.isDead()) this.bossHasEliminated()
    }

    private isChracterHaveEnoughCoin(chracter: Character, requireCoin: number): boolean {
        return chracter.coin >= requireCoin;
    }

    public async buyEquipment(chracterId: number, coin: number) {
        if (coin < 1) return;
        if (coin > 20) coin = 20;
    
        let character = await this.characterService.getCharacterById(chracterId);
        
        if (!character || !this.isChracterHaveEnoughCoin(character, coin)) return;
        
        if (character.equipment)
            await this.characterService.removeEquipment(character.id);

        let newEquipment = await this.equipmentService.createEquipment(character, coin, Math.ceil(coin / 4));
        if (!newEquipment) return;
        
        await this.characterService.removeCoinFromCharacter(character.id, coin);
        await this.playerManager.removeOnlinePlayer(character.user)
        await this.playerManager.addOnlinePlayer(character.user)
    }

    public getBossNextAttack(): Date | undefined {
        return this.bossNextAttackTime;
    }
}

export default GameManager;