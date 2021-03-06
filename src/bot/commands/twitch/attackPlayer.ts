import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import IGameService from "../../../interfaces/services/IGameService";
import { NotificationPlacement } from "../../../interfaces/websocket/IFeedApi";
import WebSocketApi from "../../../webserver/socket/api";
import AttackError from "../../errors/AttackError";
import * as services from "../../services";

class AttackPlayerCommand implements ICommand, ITwitchCommand {
    private webUI = WebSocketApi.getInstance()
    private feedPosition: NotificationPlacement = 'topRight'
    private feedDuration: number = 2.5

    match(text: string): boolean {
        return /!pvp [^ ]+/.test(text);
    }

    private async suicide(client: Client, userHash: string, username: string, channel: string, reviveTime: number) {
        let user = await services.user.getUserByHash(userHash)
        if (!user) return;

        try {
            let deadUser = await services.game.pvp(user.hash, user.hash)            
            if (!deadUser) return;

            this.webUI.showFeed(`${username} ☠️`, this.feedPosition, this.feedDuration)
            client.timeout(channel, username, reviveTime)
        } catch (error) {
        }
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        let nameTag = message.split(" ")[1]
        let attackedName = nameTag.substring(1)
        
        let game: IGameService = services.game
        let attackedCharacter = await services.character.getCharacterByName(attackedName)
        let reviveTime = Number(process.env.REVIVE_TIME || 60)

        if (!attackedCharacter) throw new Error("not found attacked character")
        if (!tags["user-id"]) throw new Error("not found attacker hash id from twitch")
        if (!tags.username) throw new Error("not found attacker username from twitch")

        let attackerId = tags["user-id"]
        let attackedId = attackedCharacter.user.hash

        if (attackedId === attackerId) {
            this.suicide(client, attackedId, tags.username, channel, reviveTime)
            return;
        }

        try {
            let deadUser = await game.pvp(attackerId, attackedId);
            if (!deadUser) return;

            client.timeout(channel, deadUser.name, reviveTime)
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