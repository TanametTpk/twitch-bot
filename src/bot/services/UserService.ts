import { User } from "../../database/entity/User";
import IUserService from "../../interfaces/IUserService";

export default class UserService implements IUserService {
    private async isUserAlreadyExists(hash: string): Promise<boolean> {
        const user = await this.getUserByHash(hash);
        if (user) return true;
        return false;
    }

    public async createUser(name: string, hash: string): Promise<User | undefined> {
        const isUserExist = await this.isUserAlreadyExists(hash)
        if (isUserExist) return;

        const user = new User();
        user.name = name;
        user.hash = hash;

        return user.save();
    }

    public getUserById(id: number): Promise<User | undefined> {
        return User.findOne(id)
    }

    public getUserByHash(hash: string): Promise<User | undefined> {
        return User.findOne({hash})
    }
}