import WebSocketApi from "../../webserver/socket/api";
import IBossSkill from "../interfaces/IBossSkill";
import BossTick from "./BossTick";
import DoNothingSkill from "./skills/DoNothingSkill";

export default class BaseBoss extends BossTick {
    protected finalAttackSkill: IBossSkill

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

    public attack(): void {
        this.finalAttackSkill.use()
    }

    public wasAttack(damage: number) {
        super.wasAttack(damage)
        let webUI = WebSocketApi.getInstance()
        webUI.updateBoss(this, true)
    }
}