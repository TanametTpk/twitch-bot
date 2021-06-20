import BaseBoss from "./Boss/BaseBoss"
import Boss from "./Boss/Boss"
import BossTick from "./Boss/BossTick"
import tick from "./helpers/tick"
import Tickable from "./interfaces/Tickable"

type BossTypes = "mini" | "normal" | "big"

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

    public spawnBoss(bossType: BossTypes): BaseBoss {
        this.isBossAlreadySpawn = true
        let newBoss: BaseBoss
        let bossLimitTime = tick.MINUTE * 15

        if (bossType === "mini") {
            newBoss = new BaseBoss("Mini Boss", 10, 1, bossLimitTime);
        }

        else if (bossType === "normal") {
            newBoss = new BaseBoss("Normal Boss", 100, 5, bossLimitTime);
        }

        else{
            newBoss = new BaseBoss("Big Boss", 100, 10, bossLimitTime);
        }

        return newBoss
    }
}