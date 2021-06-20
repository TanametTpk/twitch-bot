import WebSocketApi from "../../../../webserver/socket/api";
import IBossSpawnEvent from "../../../interfaces/Boss/IBossSpawnEvent";
import Boss from "../../Boss";

export default class DiscordNotifyEvent implements IBossSpawnEvent {
    do(boss: Boss): void {
        let webUI = WebSocketApi.getInstance();
        webUI.updateBoss(boss);
    }
}