import BaseAttackBuff from "../BaseAttackBuff"

let buff: BaseAttackBuff

beforeEach(() => {
    buff = new BaseAttackBuff("iron-fist", 1 ,5)
})

test('should return base attack buff', () => {
    expect(buff.getBaseAttack()).toEqual(5)
})

test('when init should destory should return false', () => {
    expect(buff.shouldDestroy()).toEqual(false)
})

test('after use should destory should return true', () => {
    buff.use()
    expect(buff.shouldDestroy()).toEqual(true)
})

test('when expired should destory should return true', () => {
    buff.update()
    expect(buff.shouldDestroy()).toEqual(true)
})