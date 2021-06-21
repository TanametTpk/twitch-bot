import EffectManager from "../../Time/EffectManager"
import Effect from "../Effect"

let effectManager: EffectManager
let effect: Effect

beforeEach(() => {
    effectManager = new EffectManager()

    effectManager.addEffect("dead", 1)
    effect = new Effect(effectManager)
})

test('should return true when have effect', () => {
    expect(effect.is("dead")).toEqual(true)
})

test('should return false when not have effect', () => {
    expect(effect.is("alive")).toEqual(false)
})

test('should return correct string pattern', () => {
    expect(effect.toString()).toEqual("<dead:1s>")
})

test('should return string with multiple effect correctly', () => {
    effectManager.addEffect("wtf", 2)
    let effect = new Effect(effectManager)
    expect(effect.toString()).toEqual("<dead:1s><wtf:2s>")
})

test('should not return string with 0s effect', () => {
    effectManager.addEffect("wtf", 0)
    let effect = new Effect(effectManager)
    expect(effect.toString()).toEqual("<dead:1s>")
})