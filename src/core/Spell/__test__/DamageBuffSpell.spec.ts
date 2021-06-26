import DamageBuffSpell from "../DamageBuffSpell"

let spell: DamageBuffSpell

beforeEach(() => {
    spell = new DamageBuffSpell(5)
})

test('count char should be 1', async() => {
    expect(spell.countCharacter('o', 'o')).toEqual(1)
})

test('count char should be 0 if wrong', async() => {
    expect(spell.countCharacter('o', 't')).toEqual(0)
})

test('count char should be 2', async() => {
    expect(spell.countCharacter('o', 'ot')).toEqual(2)
})

test('count char should be 6', async() => {
    expect(spell.countCharacter('o', 'otoott')).toEqual(6)
})

test('count char should be 20', async() => {
    expect(spell.countCharacter('o', 'otootttooootttttoooo')).toEqual(20)
})

test('count more than 20 should be 0', async() => {
    expect(spell.countCharacter('o', 'otootttooootttttooooo')).toEqual(0)
})