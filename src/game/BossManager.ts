import randomIntBetween from "../bot/utils/randomIntBetween";
import Boss from "./Boss";

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
        const level = this.calculateDiffuculty()
        const max_hp: number = totalOnlineDamage * 4 * (level / 10)
        return new Boss(max_hp, max_hp, level);
    }

    public spawnBoss(totalOnlineDamage: number): void {
        this.boss = this.createBoss(totalOnlineDamage);
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

        if (this.attacker.has(characterId)) {
            let prev_info = this.attacker.get(characterId)!;
            new_info.totalDamage += prev_info.totalDamage
            this.attacker.set(characterId, new_info);
            return;
        }

        this.attacker.set(characterId, new_info);
    }
}