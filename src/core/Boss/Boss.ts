
export default class Boss {
    protected name: string;
    protected hp: number;
    protected max_hp: number;
    protected level: number;

    constructor(name: string, hp: number, level: number) {
        this.name = name;
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

    public getName(): string {
        return this.name;
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