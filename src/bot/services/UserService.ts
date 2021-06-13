import IUserService from "../../interfaces/services/IUserService";
import { PrismaClient, User } from "@prisma/client";

class UserService implements IUserService {
    private client: PrismaClient

    constructor(client: PrismaClient) {
        this.client = client;
    }

    private async isUserAlreadyExists(hash: string): Promise<boolean> {
        const user = await this.getUserByHash(hash);
        if (user) return true;
        return false;
    }

    public async createUser(name: string, hash: string): Promise<User | null> {
        const isUserExist = await this.isUserAlreadyExists(hash)
        if (isUserExist) return null;

        return this.client.user.create({
            data: {
                name,
                hash,
            }
        })
    }

    public getUserById(id: number): Promise<User | null> {
        return this.client.user.findFirst({
            where: {id}
        })
    }

    public getUserByHash(hash: string): Promise<User | null> {
        return this.client.user.findFirst({
            where: {hash}
        })
    }

    public async addCheerReward(userId: number, reward: number): Promise<User | null> {
        if (reward < 1) return null;
        return this.client.user.update({
            where: { id: userId },
            data: {
                cheer: {
                    increment: reward
                }
            }
        })
    }

    public async removeCheerReward(userId: number, reward: number): Promise<User | null> {
        let user = await this.getUserById(userId);
        if (!user) return null;
        if (reward < 1) return null;
        if (user.cheer < reward) reward = user.cheer;

        return this.client.user.update({
            where: { id: userId },
            data: {
                cheer: {
                    decrement: reward
                }
            }
        })
    }
}

export default UserService;