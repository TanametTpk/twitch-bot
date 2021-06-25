import { User } from ".prisma/client";
import GameCore from "../../core";
import Boss from "../../core/Boss/Boss";

export default interface IGameService {
    attackBossBy(playerId: string): void
    pvp(attackerId: string, attackedId: string): Promise<User | null>
    getBoss(): Boss | undefined
    getBossAttackTime(): Date | undefined
    spawnBoss(): void
    getGameManager(): GameCore
    isPlayerOnline(hash: string): boolean
    giveRewardToAllPlayer(coin: number): void
    giveRewardToPlayer(hash: string, coin: number): void
    canPVP(): boolean
    setPVPModeOn(): void
    setPVPModeOff(): void
}