import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import IGameService from "../../../interfaces/services/IGameService";
import { NotificationPlacement } from "../../../interfaces/websocket/IFeedApi";
import WebSocketApi from "../../../webserver/socket/api";
import services from "../../services";

class AttackPlayerCommand implements ICommand, ITwitchCommand {
    private webUI = WebSocketApi.getInstance()
    private feedPosition: NotificationPlacement = 'topRight'
    private feedDuration: number = 2.5

    match(text: string): boolean {
        return /!pvp [^ ]+/.test(text);
    }

    private timeoutAndMessage(client: Client, channel: string, username: string, message: string, duration: number) {
        client.timeout(channel, username, duration)
        client.say(channel, message);
    }

    private async suicide(userHash: string, username: string) {
        let user = await services.user.getUserByHash(userHash)
        if (!user) return;

        services.game.pvp(user.hash, user.hash)
        this.webUI.showFeed(`${username} ☠️`, this.feedPosition, this.feedDuration)
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        let nameTag = message.split(" ")[1]
        let attackedName = nameTag.substring(1)
        
        let game: IGameService = services.game
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

        let deadUser = await game.pvp(attackerId, attackedId);
        if (!deadUser) return;

        if (deadUser.hash === attackedCharacter.user.hash) {
            this.webUI.showFeed(`${tags.username} 🗡️ ${attackedName}`, this.feedPosition, this.feedDuration)
            return
        }

        this.webUI.showFeed(`${attackedName} 🛡️🗡️ ${tags.username}`, this.feedPosition, this.feedDuration)
    }
}

export default new AttackPlayerCommand();