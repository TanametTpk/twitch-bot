import ISpell from "./interfaces/ISpell";
import Player from "./Player/Player";

export default class SpellManager {
    protected spells: ISpell[]
    
    constructor() {
        this.spells = []
    }

    public addSpell(spell: ISpell): void {
        this.spells.push(spell)
    }

    public isMatchSpell(text: string): boolean {
        for (const spell of this.spells) {
           if (spell.check(text)) return true; 
        }

        return false;
    }

    public castSpell(player: Player, text: string) {
        for (const spell of this.spells) {
            if (spell.check(text)) {
                spell.cast(player, text)
                break
            }
        }
    }
}