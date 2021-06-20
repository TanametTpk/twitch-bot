import IBossSkill from "../../interfaces/IBossSkill";
import Boss from "../Boss";

export default class DoNothingSkill implements IBossSkill {
    canUse(boss: Boss): boolean {
        return true
    }

    use(): void {}
}