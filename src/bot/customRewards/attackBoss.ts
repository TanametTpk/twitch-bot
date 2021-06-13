import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
import WebSocketApi from "../../webserver/socket/api";
import services from "../services";
import randomIntBetween from "../utils/randomIntBetween";

class AttackBossCommand extends AbstractChannelPointAction {
    constructor() {
        super("6caf7630-92a6-4484-9873-e1bc3609fe42");
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        if (!tags["user-id"]) return;
        let game = services.game;
        let playerManager = game.getGameManager().playerManager
        if (playerManager.isPlayerDead(tags["user-id"])) return;
        
        let webUI = WebSocketApi.getInstance()

        if (!game.getGameManager().bossManager.isBossHasSpawned()) {
            client.say(channel, `@${tags.username} ใจเย็นหนุ่มบอสยังไม่เกิด`);
            return;
        }

        let character = await services.character.getCharacterByUserHash(tags["user-id"]);
        if (!character) throw new Error("not found character")

        if (!game.getGameManager().canBossAttackedBy(character)) {
            client.say(channel, `@${tags.username} ตีเร็วไปแล้ว -> รอให้ครบ 30 วิแล้วค่อยตีใหม่`);
            return;
        }

        game.attackBossBy(tags["user-id"])
        webUI.showFeed(`${tags.username} 🗡️🐲`, 'topRight', 1.5)
    }
}

export default new AttackBossCommand();