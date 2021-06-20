import Boss from "../Boss/Boss"

test('should create boss', async() => {
    const boss = new Boss(100, 5)

    expect(boss.getHp()).toEqual(100)
    expect(boss.getMaxHp()).toEqual(100)
    expect(boss.getLevel()).toEqual(5)
    expect(boss.isDead()).toEqual(false)
})

test('should take damage', async() => {
    const boss = new Boss(100, 5)

    boss.wasAttack(10)

    expect(boss.getMaxHp()).toEqual(100)
    expect(boss.getHp()).toEqual(90)
})

test('should can take damage multiple', async() => {
    const boss = new Boss(100, 5)

    boss.wasAttack(10)
    boss.wasAttack(50)

    expect(boss.getMaxHp()).toEqual(100)
    expect(boss.getHp()).toEqual(40)
})

test('hp should not below than zero', async() => {
    const boss = new Boss(100, 5)

    boss.wasAttack(200)
    expect(boss.getHp()).toEqual(0)
})

test('should not take damage when attack with negative number', async() => {
    const boss = new Boss(100, 5)

    boss.wasAttack(-10)
    expect(boss.getHp()).toEqual(100)
})