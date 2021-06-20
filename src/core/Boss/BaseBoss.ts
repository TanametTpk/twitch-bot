import IBossSkill from "../interfaces/IBossSkill";
import BossTick from "./BossTick";
import DoNothingSkill from "./skills/DoNothingSkill";

export default abstract class BaseBoss extends BossTick {
    private finalAttackSkill: IBossSkill

    constructor(name: string, hp: number, level: number, bossAge: number) {
        super(name, hp, level, bossAge)
        this.finalAttackSkill = new DoNothingSkill()
    }

    public update(): void {
        super.update()
        if (this.isBossTimeout()) {
            this.finalAttackSkill.use()
        }
    }

    public setFinalAttackSkill(skill: IBossSkill): void {
        this.finalAttackSkill = skill
    }
}