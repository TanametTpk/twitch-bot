import { User } from "../database/entity/User";

export default interface IUserService {
    createUser(name: string, hash: string): Promise<User | undefined>
    getUserById(id: number): Promise<User | undefined>
    getUserByHash(hash: string): Promise<User | undefined>
}