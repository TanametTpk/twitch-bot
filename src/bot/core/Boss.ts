
export default class Boss {
    private hp!: number;
    private max_hp!: number;
    private reward!: number;
    private level!: number;

    constructor(hp: number, reward: number, level: number) {
        this.hp = hp;
        this.max_hp = hp;
        this.reward = reward;
        this.level = level;
    }

    public wasAttack(damage: number) {
        this.hp -= damage;
        if (this.isDead()) this.hp = 0;
    }

    public isDead(): boolean {
        return this.hp <= 0;
    }

    public getReward(): number {
        return this.reward;
    }

    public getMaxHp(): number {
        return this.max_hp;
    }

    public getHp(): number {
        return this.hp;
    }

    public getLevel(): number {
        return this.level;
    }
}