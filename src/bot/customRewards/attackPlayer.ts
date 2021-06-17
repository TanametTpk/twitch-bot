import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
import { NotificationPlacement } from "../../interfaces/websocket/IFeedApi";
import WebSocketApi from "../../webserver/socket/api";
import AttackError from "../errors/AttackError";
import PlayerDeadError from "../errors/PlayerDeadError";
import PVPModeOffError from "../errors/PVPModeOffError";
import services from "../services";

class AttackPlayerCommand extends AbstractChannelPointAction {
    private webUI = WebSocketApi.getInstance()
    private feedPosition: NotificationPlacement = 'topRight'
    private feedDuration: number = 2.5

    constructor() {
        super("68d5382c-f30b-45bf-842b-da7f50811eeb");
    }

    private async suicide(userHash: string, username: string) {
        let user = await services.user.getUserByHash(userHash)
        if (!user) return;

        services.game.pvp(user.hash, user.hash)
        this.webUI.showFeed(`${username} ☠️`, this.feedPosition, this.feedDuration)
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        let game = services.game
        let name = message
        let attackedName = name.startsWith("@") ? name.substring(1) : name
        let attackedCharacter = await services.character.getCharacterByName(attackedName)

        if (!attackedCharacter) throw new Error("not found attacked character")
        if (!tags["user-id"]) throw new Error("not found attacker hash id from twitch")
        if (!tags.username) throw new Error("not found attacker username from twitch")

        let attackerId = tags["user-id"]
        let attackedId = attackedCharacter.user.hash

        if (attackedId === attackerId) {
            this.suicide(attackedId, tags.username)
            return;
        }

        try {
            let deadUser = await game.pvp(attackerId, attackedId);
            if (!deadUser) return;

            if (deadUser.hash === attackedCharacter.user.hash) {
                this.webUI.showFeed(`${tags.username} 🗡️ ${attackedName}`, this.feedPosition, this.feedDuration)
                return
            }

            this.webUI.showFeed(`${attackedName} 🛡️🗡️ ${tags.username}`, this.feedPosition, this.feedDuration)

        } catch (error) {
            if (error instanceof AttackError) {
                client.say(channel, `${tags.username} ตี ${attackedName} ไม่ได้ WTF!!`);
            }
        }
    }
}

export default new AttackPlayerCommand();