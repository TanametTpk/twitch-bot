import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import IGameService from "../../../interfaces/services/IGameService";
import services from "../../services";

class AttackPlayerCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        return /!pvp [^ ]+/.test(text);
    }

    private timeoutAndMessage(client: Client, channel: string, username: string, message: string, duration: number) {
        client.timeout(channel, username, duration)
        client.say(channel, message);
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