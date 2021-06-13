import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
import { NotificationPlacement } from "../../interfaces/websocket/IFeedApi";
import WebSocketApi from "../../webserver/socket/api";
import services from "../services";

class AttackPlayerCommand extends AbstractChannelPointAction {
    constructor() {
        super("68d5382c-f30b-45bf-842b-da7f50811eeb");
    }

    private timeoutAndMessage(client: Client, channel: string, username: string, message: string, duration: number) {
        client.timeout(channel, username, duration)
        client.say(channel, message);
    }

    private async suicide(userHash: string, username: string) {
        let user = await services.user.getUserByHash(userHash)
        if (!user) return;

        let webUI = WebSocketApi.getInstance()
        let feedPosition: NotificationPlacement = 'topRight'
        let feedDuration: number = 2.5
        let playerManager = services.game.getGameManager().playerManager
        playerManager.addDeadPlayer(user)
        webUI.showFeed(`${username} ☠️`, feedPosition, feedDuration)
        return;
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        let game = services.game
        let playerManager = game.getGameManager().playerManager
        if (!game.canPVP()) return;

        let name = message
        let attackedName = name.startsWith("@") ? name.substring(1) : name
        let attackedCharacter = await services.character.getCharacterByName(attackedName)

        if (!attackedCharacter) throw new Error("not found attacked character")
        if (!tags["user-id"]) throw new Error("not found attacker hash id from twitch")
        if (!tags.username) throw new Error("not found attacker username from twitch")
        if (playerManager.isPlayerDead(tags["user-id"])) return;

        let attackerId = tags["user-id"]
        let attackedId = attackedCharacter.user.hash
        let webUI = WebSocketApi.getInstance()
        let feedPosition: NotificationPlacement = 'topRight'
        let feedDuration: number = 2.5

        if (attackedId === attackerId) {
            this.suicide(attackedId, tags.username)
            return;
        }

        let canAttackThisPlayer = playerManager.canAttackPlayer(attackedCharacter.user.hash)

        if (!canAttackThisPlayer) {
            client.say(channel, `ตี ${attackedName} ไม่เข้า!!`);
            return;
        }

        let deadUser = await game.pvp(attackerId, attackedId);
        if (!deadUser) return;
        playerManager.addDeadPlayer(deadUser)

        if (deadUser.hash === attackedCharacter.user.hash) {
            this.timeoutAndMessage(
                client,
                channel,
                attackedName,
                `@${attackedName} ถูกกระทืบโดย ${tags.username}`,
                10
            )
            webUI.showFeed(`${tags.username} 🗡️ ${attackedName}`, feedPosition, feedDuration)
            return
        }

        webUI.showFeed(`${attackedName} 🛡️🗡️ ${tags.username}`, feedPosition, feedDuration)
    }
}

export default new AttackPlayerCommand();