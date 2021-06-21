import Player from "../Player/Player";

export default interface ISpell {
    check(player: Player, text: string): boolean
    cast(player: Player, text: string): void
}