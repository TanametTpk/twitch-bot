import Boss from "./Boss";

export default class BossManager {
    private boss: Boss | undefined;
    private attacker: Map<number, number>;

    private calculateDiffuculty(): number {
        // TODO - do something here
        return 0
    }

    private createBoss(): Boss {
        // calculate boss difficulty
        const level = this.calculateDiffuculty()
        return new Boss(100, 100, level);
    }

    public spawnBoss(): void {
        this.boss = this.createBoss();

        // TODO - alert player
    }

    public isBossHasSpawned(): boolean {
        return this.boss != undefined;
    }

    public getBoss(): Boss | undefined {
        return this.boss;
    }

    public rememberAttacker(characterId: number, dmg: number) {
        if (this.attacker.has(characterId)) {
            let totalDamage = this.attacker.get(characterId)!;
            this.attacker.set(characterId, totalDamage + dmg);
            return;
        }

        this.attacker.set(characterId, dmg);
    }
}