import BuffManager from "../BuffManager"
import BaseAttackBuff from "../Buffs/BaseAttackBuff"

let manager: BuffManager

beforeEach(() => {
    manager = new BuffManager()
})

test('should not have Buff', () => {
    expect(manager.count()).toEqual(0)
})

test('should can add buff', () => {
    manager.add(new BaseAttackBuff("test", 1, 10))
    expect(manager.count()).toEqual(1)
})

test('should can get buff', () => {
    manager.add(new BaseAttackBuff("test", 1, 10))
    let buff = manager.getBuff('test')
    expect(buff).not.toBeNull()
})

test('should return null if not have buff', () => {
    let buff = manager.getBuff('test')
    expect(buff).toBeNull()
})

test('can update buff', () => {
    manager.add(new BaseAttackBuff("test", 1, 1))
    manager.update()
    let buff = manager.getBuff('test')
    expect(buff).toBeNull()
})

test('can get dmg buff', () => {
    manager.add(new BaseAttackBuff("test", 1, 1))
    expect(manager.getDmg()).toEqual(1)
})

test('not return dmg buff that expired', () => {
    manager.add(new BaseAttackBuff("test", 1, 1))
    manager.add(new BaseAttackBuff("expired", -1, 1))
    expect(manager.getDmg()).toEqual(1)
})

test('can get multiple dmg buff', () => {
    manager.add(new BaseAttackBuff("test1", 1, 1))
    manager.add(new BaseAttackBuff("test2", 1, 10))
    manager.add(new BaseAttackBuff("test3", 1, 20))
    expect(manager.getDmg()).toEqual(31)
})

test('can remove expired buff', () => {
    manager.add(new BaseAttackBuff("test1", 10, 1))
    manager.add(new BaseAttackBuff("test2", 1, 10))
    manager.add(new BaseAttackBuff("test3", 10, 20))
    manager.update()
    expect(manager.getDmg()).toEqual(21)
})

test('can trigger attack buff', () => {
    manager.add(new BaseAttackBuff("test", 10, 1))
    manager.triggerAttack()
    expect(manager.getBuff('test')?.shouldDestroy()).toEqual(true)
})

test('can remove one time buff in next update', () => {
    manager.add(new BaseAttackBuff("test", 10, 1))
    manager.triggerAttack()
    manager.update()
    expect(manager.getBuff('test')).toBeNull()
})