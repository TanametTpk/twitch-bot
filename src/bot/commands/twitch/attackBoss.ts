import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import IGameService from "../../../interfaces/services/IGameService";
import services from "../../services";
import randomIntBetween from "../../utils/randomIntBetween";

class AttackBossCommand implements ICommand, ITwitchCommand {
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

    match(text: string): boolean {
        return text === "!attack boss";
    }

    perform(client: Client, channel: string, tags: ChatUserstate, message: string): void {
        if (!tags["user-id"]) return;
        let game: IGameService = services.game;

        if (!game.getGameManager().bossManager.isBossHasSpawned()) {
            client.say(channel, `@${tags.username} ใจเย็นหนุ่มบอสยังไม่เกิด`);
            return;
        }

        game.attackBossBy(tags["user-id"])

        client.say(channel, `@${tags.username} ${this.randomWord()}`);
    }
}

export default new AttackBossCommand();