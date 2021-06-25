import randomIntBetween from "../bot/utils/randomIntBetween"
import AutoAttackBoss from "./Boss/AutoAttackBoss"
import BaseBoss from "./Boss/BaseBoss"
import RandomHitSkill from "./Boss/skills/RandomHitSkill"
import ThanosSnapSkill from "./Boss/skills/ThanosSnapSkill"
import tick from "./helpers/tick"
import Tickable from "./interfaces/Tickable"
import PlayerManager from "./PlayerManager"

export type BossTypes = "mini" | "normal" | "big"

export default class BossSpawner implements Tickable {
    protected spawnInterval: number
    protected currentInterval: number
    protected isBossAlreadySpawn: boolean

    constructor(spawnInterval: number) {
        this.spawnInterval = spawnInterval
        this.currentInterval = spawnInterval
        this.isBossAlreadySpawn = false
    }

    public start(): void {
        this.currentInterval = this.spawnInterval
    }

    public update(): void {
        this.currentInterval -= 1;
        if (this.currentInterval < 1) this.currentInterval = 0
        if (this.isBossAlreadySpawn) this.resetInterval()
    }

    public resetInterval(): void {
        this.isBossAlreadySpawn = false
        this.currentInterval = this.spawnInterval
    }

    public bossShouldSpawn(): boolean {
        return this.currentInterval < 1;
    }

    public spawnNow(): void {
        this.currentInterval = 0
    }

    public getInterval(): number {
        return this.spawnInterval
    }

    public getNextBossSpawnTime(): number {
        return this.currentInterval
    }

    public spawnBoss(bossType?: BossTypes): BaseBoss {
        this.spawnNow()
        this.isBossAlreadySpawn = true
        let newBoss: BaseBoss
        let limitTime = Number(process.env.ATTACK_BOSS_LIFE_TIME || tick.MINUTE * 15)
        bossType = bossType ? bossType : this.calculateDifficulty()

        /*
            TODO - refactor to use design pattern here
        */
        if (bossType === "mini") {
            let level = randomIntBetween(1, 3)
            let hp: number = this.calculateHp(level)
            newBoss = new BaseBoss("โง่ๆ", hp, level, limitTime);
        }

        else if (bossType === "normal") {
            let level = randomIntBetween(4, 6)
            let hp: number = this.calculateHp(level)
            newBoss = new BaseBoss("เฉยๆ", hp, level, limitTime);
        }

        else{
            let level = randomIntBetween(7, 10)
            let hp: number = this.calculateHp(level)
            let attackInterval = Number(process.env.BOSS_AUTO_ATK_INTERVAL || 15)
            let autoAtkBoss = new AutoAttackBoss("โคตวย", hp, level, limitTime, attackInterval);
            autoAtkBoss.setNormalAttackSkill(new RandomHitSkill(30))
            newBoss = autoAtkBoss
        }

        newBoss.setFinalAttackSkill(new ThanosSnapSkill())
        return newBoss
    }

    private calculateDifficulty(): BossTypes {
        let playerManager = PlayerManager.getInstance()
        let players = playerManager.getOnlinePlayers()
        let count = 0
        for (const player of players) {
            if (player.isHaveEquipment() && player.getEquipment()!.atk >= 15)
                count += 1
        }

        let ratio = count / players.length * 100
        if (ratio >= 50) return "big"
        if (ratio >= 30) return "normal"
        return "mini"
    }

    /*
        Boss hp based on all player damage
        Max hp = all player damage * expected attack times(factor)
        
        Boss Level will effect hp with formula ((level + 5) / 10)
        Max Boss Level is 10 so we need boss to loop powerful so hp will multiply by 1.5
        If Boss is Level 1 then hp will multiply by 0.5
    */
    private calculateHp(level: number): number {
        let totalDamage = PlayerManager.getInstance().getTotalOnlineDamage()
        let factor = Number(process.env.BOSS_HP_FACTOR || 4)
        let max_hp: number = totalDamage * factor * ((level + 5) / 10)

        if (max_hp < 1) max_hp = 10
        return max_hp
    }
}