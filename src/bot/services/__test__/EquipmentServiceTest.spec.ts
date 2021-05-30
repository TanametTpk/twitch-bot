import { prismaMock } from '../../../database/mockClient'
import { Character, Equipment, User } from '.prisma/client'
import IEquipmentService from '../../../interfaces/services/IEquipmentService'
import EquipmentService from '../EquipmentService'

let service: IEquipmentService

beforeEach(() => {
    service = new EquipmentService(prismaMock)
})

test('should create new equipment', async() => {
    const character: Character = { 
        id: 1,
        atk: 10,
        userId: 1,
        coin: 0
    }

    const equipment: Equipment = {
        id: 1,
        atk: 2,
        characterId: 1,
        expired_time: 3,
        last_time_check: new Date()
    }

    prismaMock.equipment.create.mockResolvedValue(equipment)

    let newEquipment = await service.createEquipment(character, 2, 3)
    expect(newEquipment).toEqual(equipment)
})

test('should get Equipment by character id', async() => {
    const equipment: Equipment = {
        id: 1,
        atk: 2,
        characterId: 1,
        expired_time: 3,
        last_time_check: new Date()
    }

    prismaMock.equipment.findFirst.mockResolvedValue(equipment)

    let targetEquipment = await service.getEquipment(1)
    expect(targetEquipment).toEqual(equipment)
})

test('should get Equipment when delete', async() => {
    const equipment: Equipment = {
        id: 1,
        atk: 2,
        characterId: 1,
        expired_time: 3,
        last_time_check: new Date()
    }

    prismaMock.equipment.delete.mockResolvedValue(equipment)

    let targetEquipment = await service.removeEquipment(1)
    expect(targetEquipment).toEqual(equipment)
})