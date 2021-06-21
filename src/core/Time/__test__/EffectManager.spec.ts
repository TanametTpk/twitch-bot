import EffectManager from "../EffectManager"

let effect: EffectManager

beforeEach(() => {
    effect = new EffectManager()
})

test('every not found effect should return 0', async() => {
    expect(effect.getEffectDuration("effect")).toEqual(0)
})

test('can set effect', async() => {
    effect.addEffect("effect", 10)
    expect(effect.getEffectDuration("effect")).toEqual(10)
})

test('effect duration will decrease 1 every update', async() => {
    effect.addEffect("effect", 10)
    effect.update()
    expect(effect.getEffectDuration("effect")).toEqual(9)
})

test('effect duration have min value is 0', async() => {
    effect.addEffect("effect", 1)
    effect.update()
    effect.update()
    expect(effect.getEffectDuration("effect")).toEqual(0)
})

test('can reset effect duration', async() => {
    effect.addEffect("effect", 10)
    effect.update()
    effect.resetEffect("effect")
    expect(effect.getEffectDuration("effect")).toEqual(10)
})

test('can add multiple effects', async() => {
    effect.addEffect("effect1", 10)
    effect.addEffect("effect2", 100)
    expect(effect.getEffectDuration("effect1")).toEqual(10)
    expect(effect.getEffectDuration("effect2")).toEqual(100)
})

test('can update multiple effects', async() => {
    effect.addEffect("effect1", 10)
    effect.addEffect("effect2", 100)
    effect.update()
    expect(effect.getEffectDuration("effect1")).toEqual(9)
    expect(effect.getEffectDuration("effect2")).toEqual(99)
})

test('can reset multiple effects seperately', async() => {
    effect.addEffect("effect1", 10)
    effect.addEffect("effect2", 100)
    effect.update()
    effect.resetEffect("effect2")
    expect(effect.getEffectDuration("effect1")).toEqual(9)
    expect(effect.getEffectDuration("effect2")).toEqual(100)
})