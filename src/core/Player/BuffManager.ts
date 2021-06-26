import Tickable from "../interfaces/Tickable";
import BuffBase from "./Buff";
import Buff from "./Buff";

export default class BuffManager implements Tickable {
    private buffMapping: Map<string, Buff>

    constructor() {
        this.buffMapping = new Map()
    }
    start(): void {}
    update(): void {
        let destroyBuffList: string[] = []
        this.buffMapping.forEach((value, key) => {
            value.update()
            if (value.shouldDestroy())
                destroyBuffList.push(key)
        }) 

        for (const key of destroyBuffList) {
            this.remove(key)
        }
    }

    public add(buff: Buff): void {
        this.buffMapping.set(buff.getName(), buff)
    }

    public remove(name: string): void {
        this.buffMapping.delete(name)
    }

    public count(): number {
        return this.buffMapping.size
    }

    public getBuff(name: string): BuffBase | null {
        if (!this.buffMapping.has(name)) return null
        return this.buffMapping.get(name)!
    }

    public getDmg(): number {
        let total = 0
        for (const [key, value] of this.buffMapping) {
            if (!value.shouldDestroy())
                total += value.getBaseAttack()
        } 

        return total
    }

    public triggerAttack(): void {
        for (const [key, value] of this.buffMapping) {
            if (value.getBaseAttack() > 0 && !value.shouldDestroy()) value.use()
        } 
    }
}