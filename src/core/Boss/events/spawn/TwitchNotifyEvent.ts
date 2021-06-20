import client from "../../../../bot/twitch";
import IBossSpawnEvent from "../../../interfaces/Boss/IBossSpawnEvent";
import Boss from "../../Boss";

export default class TwitchNotifyEvent implements IBossSpawnEvent {
    do(boss: Boss): void {
        let channel_name = process.env.tmi_channel_name as string
        client.say(channel_name, "บอสเกิดแล้ววววววว")
    }
}