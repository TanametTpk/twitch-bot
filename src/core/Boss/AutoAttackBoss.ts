import WebSocketApi from "../../webserver/socket/api";
import IBossSkill from "../interfaces/IBossSkill";
import BaseBoss from "./BaseBoss";
import DoNothingSkill from "./skills/DoNothingSkill";

export default class AutoAttackBoss extends BaseBoss {
    private normalAttackSkill: IBossSkill
    private atkTime: number

    constructor(name: string, hp: number, level: number, bossAge: number, atkTime: number) {
        super(name, hp, level, bossAge)
        this.normalAttackSkill = new DoNothingSkill()
        this.atkTime = atkTime
    }

    public update(): void {
        super.update()
        
        if (this.bossAge % this.atkTime === 0 && this.bossAge > 0) {
            this.normalAttackSkill.use()
        }
    }

    public setNormalAttackSkill(skill: IBossSkill): void {
        this.normalAttackSkill = skill
    }
}