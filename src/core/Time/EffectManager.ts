import Tickable from "../interfaces/Tickable";
import Effect from "../Player/Effect";

export default class EffectManager implements Tickable {
    private effectMapping: Map<string, number>
    private maxDurationMapping: Map<string, number>

    constructor() {
        this.effectMapping = new Map()
        this.maxDurationMapping = new Map()
    }

    start(): void {}

    update(): void {
        this.effectMapping.forEach((value, key) => {
            value -= 1
            if (value < 1) value = 0
            this.effectMapping.set(key, value)
        })
    }

    addEffect(name: string, duration: number): void {
        this.effectMapping.set(name, duration)
        this.maxDurationMapping.set(name, duration)
    }

    getEffectDuration(name: string): number {
        return this.effectMapping.get(name) || 0
    }

    getMaxDuration(name: string): number {
        return this.maxDurationMapping.get(name) || 0
    }

    resetEffect(name: string): void {
        if (!this.maxDurationMapping.has(name)) return
        let originalValue = this.maxDurationMapping.get(name)
        this.effectMapping.set(name, originalValue!)
    }

    getEffect(): Effect {
        return new Effect(this)
    }

    getAllEffectName(): string[] {
        return Array.from(this.effectMapping.keys())
    }
}