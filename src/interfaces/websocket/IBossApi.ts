import Boss from "../../game/Boss";

export default interface IBossApi {
    updateBoss(boss: Boss): void
    bossEliminated(): void
}