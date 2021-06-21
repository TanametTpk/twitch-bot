import Player from "../Player/Player";

export default interface ISpell {
    check(text: string): boolean
    cast(player: Player, text: string): void
}