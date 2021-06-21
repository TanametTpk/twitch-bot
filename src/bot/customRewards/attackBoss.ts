import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
import WebSocketApi from "../../webserver/socket/api";
import AttackError from "../errors/AttackError";
import BossNotFoundError from "../errors/BossNotFoundError";
import PlayerDeadError from "../errors/PlayerDeadError";
import * as services from "../services";
import randomIntBetween from "../utils/randomIntBetween";

class AttackBossCommand extends AbstractChannelPointAction {
    private webUI = WebSocketApi.getInstance()

    constructor() {
        super("6caf7630-92a6-4484-9873-e1bc3609fe42");
    }

    private randomWord(): string {
        let attackWords = [
            "กระโดดเข้าไปตบบอส",
            "จับบอสกระแทกเข่า",
            "รังแกบอส",
            "เอาบอสจับกดน้ำ",
            "โยนหินใส่บอส",
            "กระทืบบอส",
            "ยืนด่าบอส",
            "ใช้ความหล่อโจมตีบอส"
        ]

        return attackWords[randomIntBetween(0, attackWords.length - 1)]
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        if (!tags["user-id"]) return;
        let game = services.game;

        let character = await services.character.getCharacterByUserHash(tags["user-id"]);
        if (!character) throw new Error("not found character")

        try {
            await game.attackBossBy(tags["user-id"])
            this.webUI.showFeed(`${tags.username} 🗡️🐲`, 'topRight', 1.5)
            client.say(channel, `${tags.username} ${this.randomWord()}`)
        } catch (error) {
            if (error instanceof PlayerDeadError) {
                client.say(channel, `@${tags.username} คนตายก็อยู่นิ่งๆไป`);
            }

            if (error instanceof AttackError) {
                client.say(channel, `@${tags.username} ตีเร็วไปแล้ว -> รอให้ครบ ${process.env.ATTACK_BOSS_LIMIT_TIME || 30} วิแล้วค่อยตีใหม่`);
            }

            if (error instanceof BossNotFoundError) {
                client.say(channel, `@${tags.username} ใจเย็นหนุ่มบอสยังไม่เกิด`);
            }
        }
    }
}

export default new AttackBossCommand();