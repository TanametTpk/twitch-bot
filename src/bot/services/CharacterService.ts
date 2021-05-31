import { Character, Equipment, PrismaClient, User } from "@prisma/client";
import ICharacterService, { IncludeUserAndEquipment } from "../../interfaces/services/ICharacterService";

class CharacterService implements ICharacterService {
    private client: PrismaClient

    constructor(client: PrismaClient) {
        this.client = client;
    }

    public createCharacter(user: User): Promise<Character | null> {
        return this.client.character.create({
            data: {
                coin: 0,
                atk: 10,
                user: {
                    connect: {
                        hash: user.hash
                    }
                }
            }
        })
    }

    public getCharacterById(id: number): Promise<(Character & IncludeUserAndEquipment) | null>{
        return this.client.character.findFirst({
            where: {
                id
            },
            include: {
                user: true,
                equipment: true
            }
        })
    }

    public async getCharacterByUserId(id: number): Promise<(Character & IncludeUserAndEquipment) | null> {
        return this.client.character.findFirst({
            where: {
                userId: id
            },
            include: {
                user: true,
                equipment: true
            }
        })
    }

    public async getCharacterByUserHash(hash: string): Promise<(Character & IncludeUserAndEquipment) | null> {
        return this.client.character.findFirst({
            where: {
                user: {
                    hash
                }
            },
            include: {
                user: true,
                equipment: true
            }
        })
    }

    public async addCoinToCharacter(id: number, coin: number): Promise<Character | null> {
        return this.client.character.update({
            where: {
                id
            },
            data: {
                coin: {
                    increment: coin
                }
            }
        })
    }

    public async addCoinToAllCharacter(coin: number): Promise<void> {
        if (coin < 1) return;
        await this.client.character.updateMany({
            data: {
                coin: {
                    increment: coin
                }
            }
        })
    }

    public async removeCoinFromCharacter(id: number, coin: number): Promise<Character | null> {
        return this.client.character.update({
            where: {
                id
            },
            data: {
                coin: {
                    decrement: coin
                }
            }
        })
    }

    public async updateCharacterStatus(id: number, atk: number): Promise<Character | null> {
        return this.client.character.update({
            where: {
                id
            },
            data: {
                atk
            }
        })
    }

    public async removeEquipment(id: number): Promise<Character | null> {
        return this.client.character.update({
            where: {id},
            data: {
                equipment: {
                    delete: true
                }
            }
        })
    }

    public getAllArmedPlayer(): Promise<(Character & IncludeUserAndEquipment)[]> {
        return this.client.character.findMany({
            where: {
                equipment: {
                    isNot: null
                }
            },
            include: {
                equipment: true,
                user: true
            }
        })
    }
}

export default CharacterService;