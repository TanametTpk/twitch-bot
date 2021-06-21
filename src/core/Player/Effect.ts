import EffectManager from "../Time/EffectManager";

export default class Effect {
    constructor(private effectManager: EffectManager) {}

    public is(name: string): boolean {
        return this.effectManager.getEffectDuration(name) > 0
    }

    public toString(): string {
        let text = ""
        let effects = this.effectManager.getAllEffectName()
        for (const effect of effects) {
            let duration = this.effectManager.getEffectDuration(effect)
            if (duration > 0) text += `<${effect}:${duration}s>`
        }
        return text
    }
}