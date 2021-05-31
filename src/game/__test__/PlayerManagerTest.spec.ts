import PlayerManager, { Reward } from "../PlayerManager"
import { mock } from "jest-mock-extended"
import ICharacterService, { IncludeUserAndEquipment } from "../../interfaces/services/ICharacterService"
import { Character, Equipment } from ".prisma/client"
import { User } from "@prisma/client"
import moment from "moment"

const mockCharacterService = mock<ICharacterService>()

test('should create player manager', async() => {
    const playerManager = new PlayerManager(mockCharacterService)

    expect(playerManager.getOnlinePlayers().length).toEqual(0)
    expect(playerManager.getTotalOnlineDamage()).toEqual(0)
})

test('should return true when player online', async() => {
    const user: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }
    
    const character: Character & IncludeUserAndEquipment = {
        id: 1,
        userId: 1,
        user,
        atk: 10,
        coin: 0,
        equipment: null
    }

    const playerManager = new PlayerManager(mockCharacterService)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(character)
    await playerManager.addOnlinePlayer(user)

    expect(playerManager.isPlayerOnline(user.hash)).toEqual(true)
})

test('should return false when player not online', async() => {
    const user: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }

    const playerManager = new PlayerManager(mockCharacterService)
    expect(playerManager.isPlayerOnline(user.hash)).toEqual(false)
})

test('should add online player', async() => {
    const user: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }
    
    const character: Character & IncludeUserAndEquipment = {
        id: 1,
        userId: 1,
        user,
        atk: 10,
        coin: 0,
        equipment: null
    }

    const playerManager = new PlayerManager(mockCharacterService)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(character)
    await playerManager.addOnlinePlayer(user)

    expect(playerManager.getOnlinePlayers().length).toEqual(1)
    expect(playerManager.getTotalOnlineDamage()).toEqual(10)
})

test('should not add online player when same player is added', async() => {
    const user: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }
    
    const character: Character & IncludeUserAndEquipment = {
        id: 1,
        userId: 1,
        user,
        atk: 10,
        coin: 0,
        equipment: null
    }

    const playerManager = new PlayerManager(mockCharacterService)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(character)
    await playerManager.addOnlinePlayer(user)
    await playerManager.addOnlinePlayer(user)

    expect(playerManager.getOnlinePlayers().length).toEqual(1)
    expect(playerManager.getTotalOnlineDamage()).toEqual(10)
})

test('should not remove online player when player is not added', async() => {
    const user: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }
    
    const character: Character & IncludeUserAndEquipment = {
        id: 1,
        userId: 1,
        user,
        atk: 10,
        coin: 0,
        equipment: null
    }

    const playerManager = new PlayerManager(mockCharacterService)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(character)
    await playerManager.removeOnlinePlayer(user)

    expect(playerManager.getOnlinePlayers().length).toEqual(0)
    expect(playerManager.getTotalOnlineDamage()).toEqual(0)
})

test('should not add online player when not found character', async() => {
    const user: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }

    const playerManager = new PlayerManager(mockCharacterService)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(null)
    await playerManager.addOnlinePlayer(user)

    expect(playerManager.getOnlinePlayers().length).toEqual(0)
    expect(playerManager.getTotalOnlineDamage()).toEqual(0)
})

test('should not remove online player when not found character', async() => {
    const user1: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }

    const user2: User = {
        id: 2,
        name: "user2",
        hash: "hash2"
    }
    
    const character: Character & IncludeUserAndEquipment = {
        id: 1,
        userId: 1,
        user: user1,
        atk: 10,
        coin: 0,
        equipment: null
    }

    const playerManager = new PlayerManager(mockCharacterService)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(character)
    await playerManager.addOnlinePlayer(user1)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(null)
    await playerManager.removeOnlinePlayer(user1)

    expect(playerManager.getOnlinePlayers().length).toEqual(1)
    expect(playerManager.getTotalOnlineDamage()).toEqual(10)
})

test('should add equipment atk to total online damage', async() => {
    const user: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }

    const equipment: Equipment = {
        id: 1,
        atk: 10,
        last_time_check: new Date(),
        characterId: 1,
        expired_time: 1
    }
    
    const character: Character & IncludeUserAndEquipment = {
        id: 1,
        userId: 1,
        user,
        atk: 10,
        coin: 0,
        equipment: equipment
    }

    const playerManager = new PlayerManager(mockCharacterService)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(character)
    await playerManager.addOnlinePlayer(user)

    expect(playerManager.getOnlinePlayers().length).toEqual(1)
    expect(playerManager.getTotalOnlineDamage()).toEqual(20)
})

test('should add multiple player', async() => {
    const user1: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }

    const user2: User = {
        id: 2,
        name: "user2",
        hash: "hash2"
    }

    const equipment: Equipment = {
        id: 1,
        atk: 10,
        last_time_check: new Date(),
        characterId: 1,
        expired_time: 1
    }
    
    const character1: Character & IncludeUserAndEquipment = {
        id: 1,
        userId: 1,
        user: user1,
        atk: 10,
        coin: 0,
        equipment
    }

    const character2: Character & IncludeUserAndEquipment = {
        id: 2,
        userId: 1,
        user: user2,
        atk: 5,
        coin: 0,
        equipment: null
    }

    const playerManager = new PlayerManager(mockCharacterService)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(character1)
    await playerManager.addOnlinePlayer(user1)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(character2)
    await playerManager.addOnlinePlayer(user2)

    expect(playerManager.getOnlinePlayers().length).toEqual(2)
    expect(playerManager.getTotalOnlineDamage()).toEqual(25)
})

test('should remove player', async() => {
    const user: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }
    
    const character: Character & IncludeUserAndEquipment = {
        id: 1,
        userId: 1,
        user,
        atk: 10,
        coin: 0,
        equipment: null
    }

    const playerManager = new PlayerManager(mockCharacterService)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(character)
    await playerManager.addOnlinePlayer(user)

    await playerManager.removeOnlinePlayer(user)

    expect(playerManager.getOnlinePlayers().length).toEqual(0)
    expect(playerManager.getTotalOnlineDamage()).toEqual(0)
})

test('should remove right player', async() => {
    const user1: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }

    const user2: User = {
        id: 2,
        name: "user2",
        hash: "hash2"
    }

    const equipment: Equipment = {
        id: 1,
        atk: 10,
        last_time_check: new Date(),
        characterId: 1,
        expired_time: 1
    }
    
    const character1: Character & IncludeUserAndEquipment = {
        id: 1,
        userId: 1,
        user: user1,
        atk: 10,
        coin: 0,
        equipment
    }

    const character2: Character & IncludeUserAndEquipment = {
        id: 2,
        userId: 1,
        user: user2,
        atk: 5,
        coin: 0,
        equipment: null
    }

    const playerManager = new PlayerManager(mockCharacterService)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(character1)
    await playerManager.addOnlinePlayer(user1)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(character2)
    await playerManager.addOnlinePlayer(user2)

    mockCharacterService.getCharacterByUserId.mockResolvedValue(character1)
    await playerManager.removeOnlinePlayer(user1)

    expect(playerManager.getOnlinePlayers().length).toEqual(1)
    expect(playerManager.getOnlinePlayers()[0].id).toEqual(2)
    expect(playerManager.getTotalOnlineDamage()).toEqual(5)
})

test('should return only player base atk', async() => {
    const user: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }
    
    const character: Character & IncludeUserAndEquipment = {
        id: 1,
        userId: 1,
        user,
        atk: 10,
        coin: 0,
        equipment: null
    }

    const playerManager = new PlayerManager(mockCharacterService)
    let dmg = playerManager.calculateAttackPowerOf(character)

    expect(dmg).toEqual(10)
})

test('should return player base atk and equipment', async() => {
    const user: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }

    const equipment: Equipment = {
        id: 1,
        atk: 10,
        last_time_check: new Date(),
        characterId: 1,
        expired_time: 1
    }
    
    const character: Character & IncludeUserAndEquipment = {
        id: 1,
        userId: 1,
        user,
        atk: 10,
        coin: 0,
        equipment
    }

    const playerManager = new PlayerManager(mockCharacterService)
    let dmg = playerManager.calculateAttackPowerOf(character)

    expect(dmg).toEqual(20)
})

test('should remove right player', async() => {
    const user1: User = {
        id: 1,
        name: "user1",
        hash: "hash1"
    }

    const user2: User = {
        id: 2,
        name: "user2",
        hash: "hash2"
    }

    const user3: User = {
        id: 3,
        name: "user3",
        hash: "hash3"
    }

    const equipment: Equipment = {
        id: 1,
        atk: 10,
        last_time_check: new Date(),
        characterId: 1,
        expired_time: 1
    }

    const uncheckEquipment: Equipment = {
        id: 1,
        atk: 10,
        last_time_check: moment(new Date()).add(-1, 'days').toDate(),
        characterId: 1,
        expired_time: 1
    }

    const expiredEquipment: Equipment = {
        id: 1,
        atk: 10,
        last_time_check: moment(new Date()).add(-1, 'days').toDate(),
        characterId: 1,
        expired_time: 0
    }
    
    const character1: Character & IncludeUserAndEquipment = {
        id: 1,
        userId: 1,
        user: user1,
        atk: 10,
        coin: 0,
        equipment
    }

    const character2: Character & IncludeUserAndEquipment = {
        id: 2,
        userId: 2,
        user: user2,
        atk: 5,
        coin: 0,
        equipment: expiredEquipment
    }

    const character3: Character & IncludeUserAndEquipment = {
        id: 3,
        userId: 3,
        user: user3,
        atk: 1,
        coin: 0,
        equipment: uncheckEquipment
    }

    const playerManager = new PlayerManager(mockCharacterService)

    mockCharacterService.getAllArmedPlayer.mockResolvedValue([character1, character2, character3])
    mockCharacterService.removeEquipment.mockResolvedValue(character2)
    await playerManager.updateAllPlayerEquipment()

    expect(mockCharacterService.removeEquipment).toHaveBeenCalledTimes(1)
    expect(mockCharacterService.removeEquipment).toHaveBeenCalledWith(2)
    expect(mockCharacterService.removeEquipment).not.toHaveBeenCalledWith(1)
    expect(mockCharacterService.removeEquipment).not.toHaveBeenCalledWith(3)
})

test('should give reward to players', async() => {
    const rewards: Reward[] = [
        {
            chracterId: 1,
            coin: 5
        },
        {
            chracterId: 2,
            coin: 1
        }
    ]

    const playerManager = new PlayerManager(mockCharacterService)
    playerManager.distributeRewards(rewards)

    expect(mockCharacterService.addCoinToCharacter).toHaveBeenCalledTimes(2)
    expect(mockCharacterService.addCoinToCharacter).toHaveBeenCalledWith(1, 5)
    expect(mockCharacterService.addCoinToCharacter).toHaveBeenCalledWith(2, 1)
})