import Tickable from "./interfaces/Tickable";
import Tick from './helpers/tick';
import Boss from "./Boss/Boss";
import BossSpawner from "./BossSpawner";

export default class BossManager implements Tickable {
    private bossSpawner: BossSpawner
    private boss?: Boss

    constructor() {
        this.bossSpawner = new BossSpawner(Tick.HOUR)
    }

    start(): void {
        this.bossSpawner.start();
    }

    update(): void {
        this.bossSpawner.update();
        if (this.bossSpawner.bossShouldSpawn()) {
            this.setBoss(this.bossSpawner.spawnBoss("normal"))
        }
    }

    public setBoss(boss: Boss): void {
        this.boss = boss;
    }

    public getBoss(): Boss | undefined {
        return this.boss
    }

    public isBossSpawn(): boolean {
        return this.boss !== undefined
    }
}