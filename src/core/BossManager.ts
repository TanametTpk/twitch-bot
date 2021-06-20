import Tickable from "./interfaces/Tickable";
import Tick from './helpers/tick';
import BossSpawner from "./BossSpawner";
import NormalBoss from "./Boss/NormalBoss";
import BossBattleSystem, { BattleInfo } from "./battle/BossBattleSystem";

export default class BossManager implements Tickable {
    public battleSystem: BossBattleSystem
    public bossSpawner: BossSpawner
    private boss?: NormalBoss
    private bossSpawnEvents: IBossSpawnEvent[]
    private bossDeadEvents: IBossDeadEvent[]

    constructor() {
        this.bossSpawner = new BossSpawner(Tick.HOUR)
        this.battleSystem = new BossBattleSystem()
    }

    start(): void {
        this.bossSpawner.start();
    }

    update(): void {
        this.bossSpawner.update();
        if (this.bossSpawner.bossShouldSpawn()) {
            this.setBoss(this.bossSpawner.spawnBoss("normal"))
        }

        if (this.boss) {
            this.boss.update()

            if (this.boss.isDead()) {
                let info: BattleInfo[] = this.battleSystem.getInfo()
                this.startDeadEvent(info)
                this.battleSystem.clear()
            }
        }
    }

    public setBoss(boss: NormalBoss): void {
        this.boss = boss;
    }

    public getBoss(): NormalBoss | undefined {
        return this.boss
    }

    public isBossSpawn(): boolean {
        return this.boss !== undefined
    }

    private startDeadEvent(info: BattleInfo[]): void {
        for (const event of this.bossDeadEvents) {
            event.do(info)
        }
    }

    public addDeadEvent(event: IBossDeadEvent): void {
        this.bossDeadEvents.push(event)
    }

    public addSpawnEvent(event: IBossSpawnEvent): void {
        this.bossSpawnEvents.push(event)
    }
}