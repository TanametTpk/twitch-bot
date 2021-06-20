import { BattleInfo } from "../../battle/BossBattleSystem";
import NormalBoss from "../../Boss/NormalBoss";

export default interface IBossDeadEvent {
    do(boss: NormalBoss): void
}