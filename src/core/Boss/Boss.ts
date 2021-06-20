import BossTickAbstract from "./BossTickAbstract";

export default class Boss extends BossTickAbstract {
    private hp: number;
    private max_hp: number;
    private level: number;

    constructor(hp: number, level: number, bossAge: number) {
        super(bossAge)
        this.hp = hp;
        this.max_hp = hp;
        this.level = level;
    }

    public wasAttack(damage: number) {
        if (damage < 0) return;
        
        this.hp -= damage;
        if (this.isDead()) this.hp = 0;
    }

    public isDead(): boolean {
        return this.hp <= 0;
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