import IUserService from "../../interfaces/services/IUserService";
import prisma from '../../database/client'
import { User } from "@prisma/client";

class UserService implements IUserService {
    private async isUserAlreadyExists(hash: string): Promise<boolean> {
        const user = await this.getUserByHash(hash);
        if (user) return true;
        return false;
    }

    public async createUser(name: string, hash: string): Promise<User | null> {
        const isUserExist = await this.isUserAlreadyExists(hash)
        if (isUserExist) return null;

        return prisma.user.create({
            data: {
                name,
                hash
            }
        })
    }

    public getUserById(id: number): Promise<User | null> {
        return prisma.user.findFirst({
            where: {id}
        })
    }

    public getUserByHash(hash: string): Promise<User | null> {
        return prisma.user.findFirst({
            where: {hash}
        })
    }
}

export default new UserService();