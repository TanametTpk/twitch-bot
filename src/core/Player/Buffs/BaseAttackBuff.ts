import tick from "../../helpers/tick";
import BuffBase from "../Buff";

export default class BaseAttackBuff extends BuffBase {
    private dmg: number
    private isUse: boolean

    constructor(name: string, duration: number, value: number) {
        super(name, duration)
        this.dmg = value
        this.isUse = false
    }

    public getBaseAttack(): number {
        return this.dmg
    }
    
    public use(): void {
        this.isUse = true
    }

    public shouldDestroy(): boolean {
        return super.shouldDestroy() || this.isUse
    }
}