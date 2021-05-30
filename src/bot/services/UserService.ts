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
                hash
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
}

export default UserService;