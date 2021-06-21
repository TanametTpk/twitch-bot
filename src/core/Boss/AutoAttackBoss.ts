import WebSocketApi from "../../webserver/socket/api";
import IBossSkill from "../interfaces/IBossSkill";
import BaseBoss from "./BaseBoss";
import DoNothingSkill from "./skills/DoNothingSkill";

export default class AutoAttackBoss extends BaseBoss {
    private normalAttackSkill: IBossSkill

    constructor(name: string, hp: number, level: number, bossAge: number) {
        super(name, hp, level, bossAge)
        this.normalAttackSkill = new DoNothingSkill()
    }

    public update(): void {
        super.update()
        if (this.bossAge % 15 === 0) {
            this.normalAttackSkill.use()
        }
    }

    public setNormalAttackSkill(skill: IBossSkill): void {
        this.normalAttackSkill = skill
    }
}