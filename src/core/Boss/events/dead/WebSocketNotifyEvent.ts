import WebSocketApi from "../../../../webserver/socket/api";
import { BattleInfo } from "../../../battle/BossBattleSystem";
import IBossDeadEvent from "../../../interfaces/Boss/IBossDeadEvent";

export default class WebSocketNotifyEvent implements IBossDeadEvent {
    do(info: BattleInfo[]): void {
        let webUI = WebSocketApi.getInstance()
        webUI.bossEliminated()
    }
}