import { Character } from "@prisma/client"
import { IncludeUserAndEquipment } from "../../../interfaces/services/ICharacterService"
import Player from "../Player"

let info: Character & IncludeUserAndEquipment
let player: Player
let player2: Player

beforeEach(() => {
    info = {
        id: 1,
        userId: 1,
        coin: 12,
        atk: 10,
        user: {
            id: 1,
            name: "user1",
            hash: "hash1",
            cheer: 300
        },
        equipment: {
            id: 20,
            characterId: 1,
            expired_time: 3,
            last_time_check: new Date(),
            atk: 12
        }
    }
    player = new Player(info)
    player2 = new Player(info)
})

test('can get user info', () => {
    expect(player.getInfo()).toEqual(info)
})

test('when init player is not dead', () => {
    expect(player.isDead()).toEqual(false)
})

test('when was attack player is dead', () => {
    player.wasAttack(1)
    expect(player.isDead()).toEqual(true)
})

test('can not attack player with negative number', () => {
    player.wasAttack(-1)
    expect(player.isDead()).toEqual(false)
})

test('can not attack player with 0', () => {
    player.wasAttack(0)
    expect(player.isDead()).toEqual(false)
})

test('can attack other player', () => {
    player.attack(player2)
    expect(player.isDead()).toEqual(false)
    expect(player2.isDead()).toEqual(true)
})

test('player should revive in 60 update times', () => {
    player.wasAttack(1)
    for (let i = 0; i < 60; i++) {
        player.update()
    }
    expect(player.isDead()).toEqual(false)
})

test('player should still dead in 59 update times', () => {
    player.wasAttack(1)
    for (let i = 0; i < 59; i++) {
        player.update()
    }
    expect(player.isDead()).toEqual(true)
})

test('when not dead respawn time should be 0', () => {
    expect(player.getRespawnTime()).toEqual(0)
})

test('can get respawn time', () => {
    player.wasAttack(1)
    for (let i = 0; i < 30; i++) {
        player.update()
    }
    expect(player.getRespawnTime()).toEqual(30)
})

test('get player id should return hash id', () => {
    expect(player.getId()).toEqual(info.user.hash)
})

test('can get coin', () => {
    expect(player.getCoin()).toEqual(12)
})

test('can get base atk', () => {
    expect(player.getBaseAtk()).toEqual(10)
})

test('can get is have equipment', () => {
    expect(player.isHaveEquipment()).toEqual(true)
})

test('can get equipment', () => {
    expect(player.getEquipment()).toEqual(info.equipment)
})

test('can set equipment', () => {
    player.setEquipment(info.equipment)
    expect(player.getEquipment()).toEqual(info.equipment)
})

test('can set equipment to null', () => {
    player.setEquipment(null)
    expect(player.getEquipment()).toEqual(null)
})

test('when equipment is null should not have equipment', () => {
    player.setEquipment(null)
    expect(player.isHaveEquipment()).toEqual(false)
})

test('can get total damage', () => {
    expect(player.getTotalDamage()).toEqual(22)
})

test('when not have equipment total dmg should equal base atk', () => {
    player.setEquipment(null)
    expect(player.getTotalDamage()).toEqual(10)
})

test('when init player is not invulnerable', () => {
    expect(player.isInvulnerable()).toEqual(false)
})

test('player should invulnerble when set', () => {
    player.setInvalnerable(1)
    expect(player.isInvulnerable()).toEqual(true)
})

test('when update invulnerble effect should gone', () => {
    player.setInvalnerable(1)
    player.update()
    expect(player.isInvulnerable()).toEqual(false)
})

test('when update is less than invalnerable, effect should still working', () => {
    player.setInvalnerable(2)
    player.update()
    expect(player.isInvulnerable()).toEqual(true)
})

test('should can get effect', () => {
    player.setInvalnerable(2)
    let effect = player.getEffects()
    expect(effect.is("invulnerable")).toEqual(true)
})

test('can set effect to player', () => {
    player.setEffect("onFire", 1)
    let effect = player.getEffects()
    expect(effect.is("onFire")).toEqual(true)
})

test('when update effect time should gone', () => {
    player.setEffect("onFire", 1)
    player.update()
    let effect = player.getEffects()
    expect(effect.is("onFire")).toEqual(false)
})

test('effect should work with multiple duration', () => {
    player.setEffect("onFire", 2)
    player.update()
    let effect = player.getEffects()
    expect(effect.is("onFire")).toEqual(true)
})

test('effect should work with multiple effect', () => {
    player.setEffect("onFire", 2)
    player.setEffect("onTour", 1)
    player.update()
    let effect = player.getEffects()
    expect(effect.is("onFire")).toEqual(true)
    expect(effect.is("onTour")).toEqual(false)
})