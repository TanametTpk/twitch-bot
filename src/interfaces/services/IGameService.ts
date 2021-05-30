import Boss from "../../game/Boss";

export default interface IGameService {
    attackBossBy(playerId: string): void
    pvp(attackerId: string, attackedId: string): void
    getBoss(): Boss | undefined
    getBossAttackTime(): Date | undefined
    spawnBoss(): void
}