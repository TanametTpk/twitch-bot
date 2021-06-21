import Tickable from "./interfaces/Tickable";
import Tick from './helpers/tick';
import BossSpawner, { BossTypes } from "./BossSpawner";
import BaseBoss from "./Boss/BaseBoss";
import BossBattleSystem, { BattleInfo } from "./battle/BossBattleSystem";
import IBossDeadEvent from "./interfaces/Boss/IBossDeadEvent";
import IBossSpawnEvent from "./interfaces/Boss/IBossSpawnEvent";

export default class BossManager implements Tickable {
    private static instance: BossManager;
    public battleSystem: BossBattleSystem
    public bossSpawner: BossSpawner
    private boss?: BaseBoss
    private bossSpawnEvents: IBossSpawnEvent[]
    private bossDeadEvents: IBossDeadEvent[]

    private constructor() {
        this.bossSpawner = new BossSpawner(Tick.HOUR)
        this.battleSystem = new BossBattleSystem()
        this.bossSpawnEvents = []
        this.bossDeadEvents = []
    }

    public static getInstance(): BossManager {
        if (!BossManager.instance) {
            BossManager.instance = new BossManager();
        }

        return BossManager.instance;
    }

    start(): void {
        this.bossSpawner.start();
    }

    update(): void {
        this.spawnBossUpdate()

        if (this.boss) {
            this.boss.update()

            if (this.boss.isDead()) {
                let info: BattleInfo[] = this.battleSystem.getInfo()
                this.startDeadEvent(info)
                this.clear()
            }
        }
    }

    private spawnBossUpdate(): void {
        this.bossSpawner.update();
        if (this.bossSpawner.bossShouldSpawn()) {
            let boss = this.bossSpawner.spawnBoss()
            this.setBoss(boss)
            this.startSpawnEvent(boss)
        }
    }

    public setBoss(boss: BaseBoss): void {
        this.boss = boss;
    }

    public getBoss(): BaseBoss | undefined {
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

    private startSpawnEvent(boss: BaseBoss): void {
        for (const event of this.bossSpawnEvents) {
            event.do(boss)
        }
    }

    public addDeadEvent(event: IBossDeadEvent): void {
        this.bossDeadEvents.push(event)
    }

    public addSpawnEvent(event: IBossSpawnEvent): void {
        this.bossSpawnEvents.push(event)
    }

    public clear(): void {
        this.boss = undefined
        this.battleSystem.clear()
    }
}