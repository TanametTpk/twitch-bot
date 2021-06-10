import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
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

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        let name = message
        let attackedName = name.startsWith("@") ? name.substring(1) : name
        
        let game = services.game
        let attackedCharacter = await services.character.getCharacterByName(attackedName)

        if (!attackedCharacter) throw new Error("not found attacked character")
        if (!tags["user-id"]) throw new Error("not found attacker hash id from twitch")
        if (!tags.username) throw new Error("not found attacker username from twitch")

        let attackerId = tags["user-id"]
        let attackedId = attackedCharacter.user.hash
        let webUI = WebSocketApi.getInstance()

        if (attackedId === attackerId) {
            webUI.showFeed(`${tags.username} ☠️`, 'topRight', 1.5)
            return;
        }

        let deadUser = await game.pvp(attackerId, attackedId);
        if (!deadUser) return;

        if (deadUser.hash === attackedCharacter.user.hash) {
            this.timeoutAndMessage(
                client,
                channel,
                attackedName,
                `@${attackedName} ถูกกระทืบโดย ${tags.username}`,
                60
            )
            webUI.showFeed(`${attackedName} 🗡️ ${tags.username}`, 'topRight', 1.5)
            return
        }

        webUI.showFeed(`${tags.username} 🛡️🗡️ ${attackedName}`, 'topRight', 1.5)
    }
}

export default new AttackPlayerCommand();