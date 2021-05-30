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
        hash: "hash1"
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
        hash: "hash1"
    }

    prismaMock.user.findFirst.mockResolvedValue(user)

    let newUser = await service.createUser(user.name, user.hash)
    expect(newUser).toEqual(null)
})

test('should get user by id', async() => {
    const user: User = { 
        id: 1,
        name: "user1",
        hash: "hash1"
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
        hash: "hash1"
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