import { Character } from "../../database/entity/Character";
import Boss from "../../game/Boss";

export default interface IGameService {
    attackBossBy(playerId: number): void
    pvp(attackerId: number, attackedId: number): void
    getBoss(): Boss | undefined
    getBossAttackTime(): Date | undefined
}