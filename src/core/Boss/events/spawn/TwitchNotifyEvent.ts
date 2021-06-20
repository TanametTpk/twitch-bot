import client from "../../../../bot/twitch";
import IBossSpawnEvent from "../../../interfaces/Boss/IBossSpawnEvent";
import Boss from "../../Boss";

export default class TwitchNotifyEvent implements IBossSpawnEvent {
    do(boss: Boss): void {
        client.say(process.env.tmi_channel_name as string, `บอส ${boss.getName()} level: ${boss.getLevel()} เกิดแล้ววววว`)
    }
}