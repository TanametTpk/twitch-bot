import EffectManager from "../Time/EffectManager";

export default class Effect {
    constructor(private effectManager: EffectManager) {}

    is(name: string): boolean {
        return this.effectManager.getEffectDuration(name) > 0
    }
}