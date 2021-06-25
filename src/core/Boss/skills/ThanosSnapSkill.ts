import client from "../../../bot/twitch";
import roll from "../../../bot/utils/roll";
import sleep from "../../../bot/utils/sleep";
import BossManager from "../../BossManager";
import IBossSkill from "../../interfaces/IBossSkill";
import Boss from "../Boss";

export default class ThanosSnapSkill implements IBossSkill {
    canUse(boss: Boss): boolean {
        return true
    }

    async use() {
        let channel_name = process.env.tmi_channel_name as string
        let timeoutSeconds = 60;
        let casualties = 0;

        let battleInfo = BossManager.getInstance().battleSystem.getInfo()
        
        for (let info of battleInfo) {
            let username = info.player.getUser().name
            if (roll(50)) {
                casualties++;
                client.timeout(channel_name, username, timeoutSeconds, `โดนจมตีน`);
                await sleep(620);
            }
        }
        client.say(channel_name, `บอสทำการใช้สกิลตีหมู่ มี ${casualties} คนในแชทได้รับบาดเจ็บ....`);
    }
}