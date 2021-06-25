import Boss from "../../core/Boss/Boss";

export default interface IBossApi {
    updateBoss(boss: Boss): void
    bossEliminated(): void
}