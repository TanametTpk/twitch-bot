import client from "../../../bot/twitch";
import roll from "../../../bot/utils/roll";
import sleep from "../../../bot/utils/sleep";
import IBossSkill from "../../interfaces/IBossSkill";
import PlayerManager from "../../PlayerManager";
import Boss from "../Boss";

export default class RandomHitSkill implements IBossSkill {
    private timeoutSeconds: number

    constructor(timeout: number) {
        this.timeoutSeconds = timeout
    }

    canUse(boss: Boss): boolean {
        return true
    }

    async use() {
        let channel_name = process.env.tmi_channel_name as string
        let casualties = 0;

        let players = PlayerManager.getInstance().getOnlinePlayers()
        
        for (let player of players) {
            let username = player.getInfo().user.name
            if (roll(1)) {
                casualties++;
                client.timeout(channel_name, username, this.timeoutSeconds, `โดนบอสจมตีน`);
                await sleep(620);
            }
        }
        client.say(channel_name, `มี ${casualties} คนในแชท โดนบอสทุบ`);
    }
}