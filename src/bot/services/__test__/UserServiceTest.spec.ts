import UserService from '../UserService'
import { prismaMock } from '../../../database/mockClient'
import { User } from '.prisma/client'
import IUserService from '../../../interfaces/services/IUserService'

let service: IUserService

beforeEach(() => {
    service = new UserService(prismaMock)
})

test('should create new user ', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1",
        cheer: 0
    }

    prismaMock.user.create.mockResolvedValue(user)

    let newUser = await service.createUser(user.name, user.hash)
    expect(newUser?.name).toEqual("user1")
    expect(newUser?.hash).toEqual("hash1")
})

test('should return null when user hash existed', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1",
        cheer: 0
    }

    prismaMock.user.findFirst.mockResolvedValue(user)

    let newUser = await service.createUser(user.name, user.hash)
    expect(newUser).toEqual(null)
})

test('should get user by id', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1",
        cheer: 0
    }

    await prismaMock.user.findFirst.mockResolvedValue(user)

    let targetUser = await service.getUserById(1)
    expect(targetUser?.id).toEqual(1)
})

test('should return null when id not exist', async() => {
    await prismaMock.user.findFirst.mockResolvedValue(null)

    let targetUser = await service.getUserById(1)
    expect(targetUser).toEqual(null)
})

test('should get user by hash', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1",
        cheer: 0
    }

    await prismaMock.user.findFirst.mockResolvedValue(user)

    let targetUser = await service.getUserByHash("hash1")
    expect(targetUser?.id).toEqual(1)
})

test('should return null when hash not exist', async() => {
    await prismaMock.user.findFirst.mockResolvedValue(null)

    let targetUser = await service.getUserByHash("hash1")
    expect(targetUser).toEqual(null)
})

test('should add cheer to user', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1",
        cheer: 10
    }

    await prismaMock.user.update.mockResolvedValue(user)

    let targetUser = await service.addCheerReward(1, 10)
    expect(targetUser).toEqual(user)
})

test('should return null when add cheer with negative number', async() => {
    let targetUser = await service.addCheerReward(1, -5)
    expect(targetUser).toEqual(null)
})

test('should remove cheer from user', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1",
        cheer: 10
    }

    const expectedUser: User = { 
        id: 1,
        name: "user1",
        hash: "hash1",
        cheer: 0
    }

    await prismaMock.user.findFirst.mockResolvedValue(user)
    await prismaMock.user.update.mockResolvedValue(expectedUser)

    let targetUser = await service.removeCheerReward(1, 10)
    expect(targetUser).toEqual(expectedUser)
})

test('should remove all cheer from user when reward is more than user cheer', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1",
        cheer: 10
    }

    const expectedUser: User = { 
        id: 1,
        name: "user1",
        hash: "hash1",
        cheer: 0
    }

    await prismaMock.user.findFirst.mockResolvedValue(user)
    await prismaMock.user.update.mockResolvedValue(expectedUser)

    let targetUser = await service.removeCheerReward(1, 100)
    expect(targetUser).toEqual(expectedUser)
})

test('should return null when remove cheer with negative number', async() => {
    let targetUser = await service.addCheerReward(1, -5)
    expect(targetUser).toEqual(null)
})