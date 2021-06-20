import client from "../../../../bot/twitch";
import { BattleInfo } from "../../../battle/BossBattleSystem";
import IBossDeadEvent from "../../../interfaces/Boss/IBossDeadEvent";

export default class TwitchNotifyEvent implements IBossDeadEvent {
    do(info: BattleInfo[]): void {
        client.say(process.env.tmi_channel_name as string, `บอส สิ้นลมแล้ว`)
    }
}