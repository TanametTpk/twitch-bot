import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
import * as services from "../services";

class AddCoinAction extends AbstractChannelPointAction {
    constructor() {
        super("d94548d4-52cf-47c3-ac0a-bc16d53c8f8a", false);
    }

    async perform(client: Client, channel: string, userstate: ChatUserstate, message: string): Promise<void> {
        if (!userstate["user-id"]) return;
        let character = await services.character.getCharacterByUserHash(userstate["user-id"])

        if (!character) return;
        await services.character.addCoinToCharacter(character.id, 1)

        client.say(channel, `
            @${userstate.username} แลกเงินสำเร็จแล้ว
        `)
    }
}

export default new AddCoinAction();