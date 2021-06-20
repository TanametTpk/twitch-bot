import moment from "moment"
import NormalBoss from "../Boss/NormalBoss"
import Player from "../Player/Player"

export interface BattleInfo {
    player: Player,
    damage: number,
    attack_at: Date
}

export default class BossBattleSystem {
    private battleInfo: Map<string, BattleInfo>

    public constructor() {
        this.battleInfo = new Map()
    }

    public getInfo(): BattleInfo[] {
        return Array.from(this.battleInfo.values())
    }

    public clear(): void {
        this.battleInfo.clear()
    }

    public attack(player: Player, boss: NormalBoss): void {
        if (!this.canAttackBoss(player)) throw new Error()
        let prevHp = boss.getHp()
        player.attack(boss)
        let dealingDamage = prevHp - boss.getHp()
        this.record(player, dealingDamage)
    }

    public canAttackBoss(player: Player): boolean {
        let info = this.battleInfo.get(player.getId())
        if (!info) return true;
        
        let lasttime = moment(info.attack_at);
        let now = moment();
        let diffMin = now.diff(lasttime, 'seconds', true);
        let limitTime = process.env.ATTACK_BOSS_LIMIT_TIME || 30
        return diffMin > limitTime; 
    }

    private record(player: Player, damage: number): void {
        let info = this.battleInfo.get(player.getId())
        if (info) {
            info.damage += damage
            info.attack_at = new Date()
            this.battleInfo.set(player.getId(), info)
            return
        }

        this.battleInfo.set(player.getId(), {
            player,
            damage,
            attack_at: new Date()
        })
    }
}