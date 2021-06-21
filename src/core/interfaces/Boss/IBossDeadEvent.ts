import { BattleInfo } from "../../battle/BossBattleSystem";

export default interface IBossDeadEvent {
    do(info: BattleInfo[]): void
}