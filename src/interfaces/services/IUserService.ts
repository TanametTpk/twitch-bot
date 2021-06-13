import { User } from "@prisma/client";

export default interface IUserService {
    createUser(name: string, hash: string): Promise<User | null>
    getUserById(id: number): Promise<User | null>
    getUserByHash(hash: string): Promise<User | null>
    addCheerReward(userId: number, reward: number): Promise<User | null>
    removeCheerReward(userId: number, reward: number): Promise<User | null>
}