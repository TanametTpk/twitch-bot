import { User } from ".prisma/client";
import GameManager from "../../game";
import Boss from "../../game/Boss";

export default interface IGameService {
    attackBossBy(playerId: string): void
    pvp(attackerId: string, attackedId: string): Promise<User | null>
    getBoss(): Boss | undefined
    getBossAttackTime(): Date | undefined
    spawnBoss(): void
    getGameManager(): GameManager
    isPlayerOnline(hash: string): boolean
    giveRewardToAllPlayer(coin: number): void
    giveRewardToPlayer(hash: string, coin: number): void
}