import { prismaMock } from '../../../database/mockClient'
import { Character, Equipment, User } from '.prisma/client'
import ICharacterService, { IncludeUserAndEquipment } from '../../../interfaces/services/ICharacterService'
import CharacterService from '../CharacterService'

let service: ICharacterService

beforeEach(() => {
    service = new CharacterService(prismaMock)
})

test('should create new character ', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1"
    }

    const character: Character = {
        id: 1,
        userId: user.id,
        coin: 0,
        atk: 10
    }

    prismaMock.character.create.mockResolvedValue(character)

    let newCharacter = await service.createCharacter(user)
    expect(newCharacter).toEqual({
        id: 1,
        userId: 1,
        coin: 0,
        atk: 10
    })
})

test('should get character by id', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1"
    }

    const character: Character & IncludeUserAndEquipment = {
        id: 1,
        coin: 0,
        atk: 10,
        userId: user.id,
        user,
        equipment: null
    }

    prismaMock.character.findFirst.mockResolvedValue(character)

    let newCharacter = await service.getCharacterById(1)
    expect(newCharacter).toEqual(character)
})

test('should return null when id not exist', async() => {
    prismaMock.character.findFirst.mockResolvedValue(null)

    let newCharacter = await service.getCharacterById(1)
    expect(newCharacter).toEqual(null)
})

test('should get character by user id', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1"
    }

    const character: Character & IncludeUserAndEquipment = {
        id: 3,
        coin: 0,
        atk: 10,
        userId: user.id,
        user,
        equipment: null
    }

    prismaMock.character.findFirst.mockResolvedValue(character)

    let newCharacter = await service.getCharacterByUserId(1)
    expect(newCharacter).toEqual(character)
})

test('should return null when user id not exist', async() => {
    prismaMock.character.findFirst.mockResolvedValue(null)

    let newCharacter = await service.getCharacterByUserId(1)
    expect(newCharacter).toEqual(null)
})

test('should get character by user hash', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1"
    }

    const character: Character & IncludeUserAndEquipment = {
        id: 1,
        coin: 0,
        atk: 10,
        userId: user.id,
        user,
        equipment: null
    }

    prismaMock.character.findFirst.mockResolvedValue(character)

    let newCharacter = await service.getCharacterByUserHash('hash')
    expect(newCharacter).toEqual(character)
})

test('should return null when user hash not exist', async() => {
    prismaMock.character.findFirst.mockResolvedValue(null)

    let newCharacter = await service.getCharacterByUserHash('hash1')
    expect(newCharacter).toEqual(null)
})

test('should update coin by adding', async() => {
    const character: Character = {
        id: 1,
        coin: 5,
        atk: 10,
        userId: 1
    }

    prismaMock.character.update.mockResolvedValue(character)

    let newCharacter = await service.addCoinToCharacter(1, 5)
    expect(newCharacter).toEqual(character)
})

test('should not add coin when coin is negative', async() => {
    const character: Character = {
        id: 1,
        coin: 0,
        atk: 10,
        userId: 1
    }

    prismaMock.character.update.mockResolvedValue(character)

    let newCharacter = await service.addCoinToCharacter(1, -5)
    expect(newCharacter).toEqual(character)
})

test('should update coin by removing', async() => {
    const character: Character = {
        id: 1,
        coin: 0,
        atk: 10,
        userId: 1
    }

    prismaMock.character.update.mockResolvedValue(character)

    let newCharacter = await service.removeCoinFromCharacter(1, 5)
    expect(newCharacter).toEqual(character)
})

test('should not remove coin when coin is negative', async() => {
    const character: Character = {
        id: 1,
        coin: 5,
        atk: 10,
        userId: 1
    }

    prismaMock.character.update.mockResolvedValue(character)

    let newCharacter = await service.removeCoinFromCharacter(1, -5)
    expect(newCharacter).toEqual(character)
})

test('should update character', async() => {
    const character: Character = {
        id: 1,
        coin: 0,
        atk: 20,
        userId: 1
    }

    prismaMock.character.update.mockResolvedValue(character)

    let newCharacter = await service.updateCharacterStatus(1, 20)
    expect(newCharacter).toEqual(character)
})

test('should return character when set equipment', async() => {
    const character: Character = {
        id: 1,
        coin: 0,
        atk: 10,
        userId: 1
    }

    const equipment: Equipment = {
        id: 1,
        atk: 3,
        expired_time: 1,
        last_time_check: new Date(),
        characterId: 1
    }

    prismaMock.character.update.mockResolvedValue(character)

    let newCharacter = await service.setEquipment(1, equipment)
    expect(newCharacter).toEqual(character)
})

test('should return character when remove equipment', async() => {
    const character: Character = {
        id: 1,
        coin: 0,
        atk: 10,
        userId: 1
    }

    prismaMock.character.update.mockResolvedValue(character)

    let newCharacter = await service.removeEquipment(1)
    expect(newCharacter).toEqual(character)
})

test('should return characters that have equipment', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1"
    }
    
    const equipment: Equipment = {
        id: 1,
        atk: 3,
        expired_time: 1,
        last_time_check: new Date(),
        characterId: 1
    }
    
    const character: Character & IncludeUserAndEquipment = {
        id: 1,
        coin: 0,
        atk: 10,
        userId: 1,
        user,
        equipment,
    }

    prismaMock.character.findMany.mockResolvedValue([character])

    let newCharacter = await service.getAllArmedPlayer()
    expect(newCharacter).toEqual([character])
})