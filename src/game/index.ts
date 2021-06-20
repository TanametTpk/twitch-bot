import BossManager from "./BossManager";
import PlayerManager, { Reward } from "./PlayerManager";
import cron from 'node-cron';
import client from '../bot/twitch';
import roll from "../bot/utils/roll";
import sleep from "../bot/utils/sleep";
import moment from 'moment';
import ICharacterService, { IncludeUserAndEquipment } from "../interfaces/services/ICharacterService";
import IEquipmentService from "../interfaces/services/IEquipmentService";
import { Character, User } from "@prisma/client";
import { setTimeout } from "timers";
import WebSocketApi from "../webserver/socket/api";
import Shop from "./Shop";

class GameManager {
    public bossManager: BossManager;
    public playerManager: PlayerManager;
    public shop: Shop;
    public attackPlayerTask: NodeJS.Timer | undefined;
    public notifyAttack: NodeJS.Timer | undefined;
    private bossNextAttackTime: Date | undefined;
    private characterService: ICharacterService;
    private canPvp = true;

    constructor(characterService: ICharacterService, equipmentService: IEquipmentService) {
        this.bossManager = new BossManager();
        this.playerManager = new PlayerManager(characterService, equipmentService);
        this.shop = new Shop(characterService, equipmentService)

        this.characterService = characterService;

        this.playerManager.updateAllPlayerEquipment()
        this.scheduleEvent()
    }

    private scheduleEvent(): void {
        let allow_auto_pvp = process.env.ALLOW_AUTO_PVP === "true"

        cron.schedule('0 0 * * * *', () => {
            this.spawnBoss()
        })

        cron.schedule('0 */1 * * * *', () => {
            this.updateBossUI()
        })

        if (allow_auto_pvp) cron.schedule('0 */30 * * * *', () => {
            this.toggleEnableDisablePvp()
        })
    }

    public toggleEnableDisablePvp() {
        this.canPvp = !this.canPvp
        let channel_name = process.env.tmi_channel_name as string
        client.say(channel_name, `pvp mode: ${this.canPvp ? "on": "off"}`);
    }

    private updateBossUI() {
        let boss = this.bossManager.getBoss()
        if (!boss) return;

        let webUI = WebSocketApi.getInstance()
        webUI.updateBoss(boss)
    }

    public spawnBoss(): void {
        this.clearBossAttackTask();

        let totalOnlineDamage: number = this.playerManager.getTotalOnlineDamage();
        this.bossManager.spawnBoss(totalOnlineDamage);

        let fourTeenMinutes: number = 14 * 60 * 1000;
        let fiveTeenMinutes: number = 15 * 60 * 1000;
        let channel_name = process.env.tmi_channel_name as string
        this.bossNextAttackTime = moment().add(fiveTeenMinutes, 'millisecond').toDate();
        this.attackPlayerTask = setTimeout(() => {
            this.bossAttackRandomPlayer()
        }, fiveTeenMinutes);

        this.notifyAttack = setTimeout(() => {
            client.say(channel_name, `อีก 1 นาทีเตรียมตัวตาย`);
        }, fourTeenMinutes)
    }

    private clearBossAttackTask(): void {
        if (this.attackPlayerTask)
            clearTimeout(this.attackPlayerTask)

        if (this.notifyAttack)
            clearTimeout(this.notifyAttack)
        this.bossManager.clear();
    }

    private async randomMutePlayers() {
        let channel_name = process.env.tmi_channel_name as string
        let timeoutSeconds = 60;
        let casualties = 0;

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
        let topFiveList: (Character & IncludeUserAndEquipment)[] = []
        let luckyList: (Character & IncludeUserAndEquipment)[] = []
        let createRewards: Promise<Reward | undefined>[] = playerIdList.map(async(playerId) => {
            let isExtraReward = roll(5)
            let character = await this.characterService.getCharacterByUserId(playerId)
            let reward: number = isExtraReward ? 2 : 1;
            if (!character) return;
            if (topFiveDmgId.includes(playerId)) {
                reward = 3;
                topFiveList.push(character)
            }

            if (isExtraReward && !topFiveDmgId.includes(playerId)) {
                luckyList.push(character)
            }

            return {
                characterId: character.id,
                coin: reward
            }
        })

        let rawRewards: (Reward | undefined)[] = await Promise.all(createRewards);
        let rewards: Reward[] = rawRewards.filter(reward => reward) as Reward[]
        this.playerManager.distributeRewards(rewards);

        this.clearBossAttackTask();
        
        let webUI = WebSocketApi.getInstance()
        webUI.bossEliminated()
        client.say(process.env.tmi_channel_name as string, `บอสถูกกำจัดแล้ว เอารางวัลไปซะเหล่านักพจญภัย`)
        client.say(process.env.tmi_channel_name as string, `--- top 5 most damage ---`)
        let topFiveText = ""
        for (let player of topFiveList) {
            let username = player.user.name
            topFiveText += `<${username}>`
        }
        client.say(process.env.tmi_channel_name as string, topFiveText)

        if (luckyList.length > 0) {
            client.say(process.env.tmi_channel_name as string, `--- lucky list ---`)
            let luckyText = ""
            for (let player of luckyList) {
                let username = player.user.name
                luckyText += `<${username}>`
            }
            client.say(process.env.tmi_channel_name as string, luckyText)
        }
    }

    public bossAttackRandomPlayer() {
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
        let limitTime = process.env.ATTACK_BOSS_LIMIT_TIME || 30
        return diffMin > limitTime;
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

    public killBoss() {
        if (!this.bossManager.isBossHasSpawned()) return
        this.bossManager.clear()
        this.bossHasEliminated()
    }

    public async buyEquipment(characterId: number, coin: number) {
        let character = await this.shop.buyEquipment(characterId, coin)
        if (!character) return;

        await this.updatePlayerDamage(character.user)
    }

    private async updatePlayerDamage(user: User): Promise<void> {
        await this.playerManager.removeOnlinePlayer(user)
        await this.playerManager.addOnlinePlayer(user)
    }

    public getBossNextAttack(): Date | undefined {
        return this.bossNextAttackTime;
    }

    public getCanPvp(): boolean {
        return this.canPvp
    }
}

export default GameManager;