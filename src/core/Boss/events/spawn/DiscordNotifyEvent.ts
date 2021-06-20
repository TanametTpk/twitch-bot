import { TextChannel } from "discord.js";
import client from "../../../../bot/discord";
import IBossSpawnEvent from "../../../interfaces/Boss/IBossSpawnEvent";
import Boss from "../../Boss";

export default class DiscordNotifyEvent implements IBossSpawnEvent {
    do(boss: Boss): void {
        if (process.env.DISCORD_CH_ID) {
            let channel = client.channels.cache.get(process.env.DISCORD_CH_ID)
            if (!channel) return;
            if (!channel.isText()) return;
            (<TextChannel> channel).send(`
                --- Boss ${boss.getName()} Status ---
                Level ${boss.getLevel()}
                Max Hp ${boss.getMaxHp()}
                Current Hp ${boss.getHp()}
            `)
        }
    }
}