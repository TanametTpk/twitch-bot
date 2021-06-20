import client from "../bot/twitch";
import discordClient from '../bot/discord'
import randomIntBetween from "../bot/utils/randomIntBetween";
import WebSocketApi from "../webserver/socket/api";
import Boss from "./Boss";
import { TextChannel } from "discord.js";

interface AttackInfo {
    totalDamage: number
    last_attack_time: Date
}

export default class BossManager {
    private boss: Boss | undefined;
    public attacker: Map<number, AttackInfo>;

    constructor() {
        this.attacker = new Map();
    }

    private calculateDiffuculty(): number {
        return randomIntBetween(1, 10);
    }

    private createBoss(totalOnlineDamage: number): Boss {
        let factor = Number(process.env.BOSS_HP_FACTOR || 4)
        const level = this.calculateDiffuculty()
        let max_hp: number = totalOnlineDamage * factor * ((level + 5) / 10)

        if (max_hp < 1) max_hp = 10
        return new Boss(max_hp, level);
    }

    public spawnBoss(totalOnlineDamage: number): void {
        this.boss = this.createBoss(totalOnlineDamage);
        let webUI = WebSocketApi.getInstance();

        client.say(process.env.tmi_channel_name as string, `บอส level: ${this.boss.getLevel()} เกิดแล้ววววว`)
        webUI.updateBoss(this.boss);

        if (process.env.DISCORD_CH_ID) {
            let channel = discordClient.channels.cache.get(process.env.DISCORD_CH_ID)
            if (!channel) return;
            if (!channel.isText()) return;

            (<TextChannel> channel).send(`
                --- Boss Status ---
                Level ${this.boss.getLevel()}
                Max Hp ${this.boss.getMaxHp()}
                Current Hp ${this.boss.getHp()}
            `)
        }
    }

    public isBossHasSpawned(): boolean {
        return this.boss != undefined;
    }

    public getBoss(): Boss | undefined {
        return this.boss;
    }

    public clear(): void {
        this.boss = undefined;
        this.attacker.clear();
    }

    public rememberAttacker(characterId: number, dmg: number) {
        let new_info: AttackInfo = {
            totalDamage: dmg,
            last_attack_time: new Date()
        }

        if (dmg < 1 || !this.isBossHasSpawned()) return;

        if (this.attacker.has(characterId)) {
            let prev_info = this.attacker.get(characterId)!;
            new_info.totalDamage += prev_info.totalDamage
            this.attacker.set(characterId, new_info);
            return;
        }

        this.attacker.set(characterId, new_info);
        
        if (this.boss) {
            let webUI = WebSocketApi.getInstance();
            webUI.updateBoss(this.boss, true);
        }
    }
}