import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
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

        if (attackedId === attackerId) {
            this.timeoutAndMessage(
                client,
                channel,
                tags.username,
                `@${tags.username} ฆ่าตัวตาย`,
                60
            )
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
            return
        }

        this.timeoutAndMessage(
            client,
            channel,
            tags.username,
            `อะไรกัน!! @${tags.username} โดน ${attackedName} counter attack ว่ะ!`,
            60
        )
    }
}

export default new AttackPlayerCommand();