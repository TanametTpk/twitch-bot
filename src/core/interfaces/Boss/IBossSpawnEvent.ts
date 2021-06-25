import Boss from "../../Boss/Boss";

export default interface IBossSpawnEvent {
    do(boss: Boss): void
}