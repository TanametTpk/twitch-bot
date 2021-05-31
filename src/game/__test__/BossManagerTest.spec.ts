import BossManager from "../BossManager"

test('when create should not have boss spawn', async() => {
    const bossManager = new BossManager()

    expect(bossManager.getBoss()).toEqual(undefined)
})

test('when create should not have attacker', async() => {
    const bossManager = new BossManager()

    expect(bossManager.attacker.size).toEqual(0)
})

test('when spawn boss should have boss', async() => {
    const bossManager = new BossManager()
    bossManager.spawnBoss(0)
    expect(bossManager.getBoss()).not.toEqual(undefined)
})

test('boss should have hp related to online player damage', async() => {
    const bossManager = new BossManager()
    bossManager.spawnBoss(100)
    let boss = bossManager.getBoss()

    expect(boss!.getMaxHp()).toEqual(100 * 4 * boss!.getLevel() / 10)
})

test('boss should have level between 1 to 10', async() => {
    const bossManager = new BossManager()
    let bossLevelList = []
    bossManager.spawnBoss(100)
    
    for (let i = 0; i < 25; i++) {
        bossManager.spawnBoss(100)
        bossLevelList.push(bossManager.getBoss())
    }

    let isBetweenOneToTen = bossLevelList.every(
        (boss) => boss!.getLevel() >= 1 && boss!.getLevel() <= 10
    )
    
    expect(isBetweenOneToTen).toEqual(true)
})

test('when boss spawned should return true', async() => {
    const bossManager = new BossManager()
    bossManager.spawnBoss(100)
    expect(bossManager.isBossHasSpawned()).toEqual(true)
})

test('when boss not spawned should return false', async() => {
    const bossManager = new BossManager()
    expect(bossManager.isBossHasSpawned()).toEqual(false)
})

test('when attacked boss should remember attacker', async() => {
    const bossManager = new BossManager()
    bossManager.spawnBoss(100)
    bossManager.rememberAttacker(1, 10)
    expect(bossManager.attacker.get(1)?.totalDamage).toEqual(10)
})

test('when attacked boss with same player should add to total damage', async() => {
    const bossManager = new BossManager()
    bossManager.spawnBoss(100)
    bossManager.rememberAttacker(1, 10)
    bossManager.rememberAttacker(1, 10)
    expect(bossManager.attacker.get(1)?.totalDamage).toEqual(20)
})

test('should not take damage when attack with nagative number', async() => {
    const bossManager = new BossManager()
    bossManager.spawnBoss(100)
    bossManager.rememberAttacker(1, -10)
    expect(bossManager.attacker.get(1)).toEqual(undefined)
})

test('should not remember when boss not spawed', async() => {
    const bossManager = new BossManager()
    bossManager.rememberAttacker(1, 10)
    expect(bossManager.attacker.get(1)).toEqual(undefined)
})

test('should clear boss and attacker', async() => {
    const bossManager = new BossManager()
    bossManager.spawnBoss(10)
    bossManager.rememberAttacker(1, 10)

    bossManager.clear()

    expect(bossManager.isBossHasSpawned()).toEqual(false)
    expect(bossManager.attacker.size).toEqual(0)
})