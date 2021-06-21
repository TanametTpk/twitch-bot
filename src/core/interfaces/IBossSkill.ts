import Boss from "../Boss/Boss";

export default interface IBossSkill {
    canUse(boss: Boss): boolean
    use(): void
}