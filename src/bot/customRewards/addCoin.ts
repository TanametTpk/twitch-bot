import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
import services from "../services";

class AddCoinAction extends AbstractChannelPointAction {
    constructor() {
        super("68d5382c-f30b-45bf-842b-da7f50811eeb");
    }

    async perform(client: Client, channel: string, userstate: ChatUserstate, message: string): Promise<void> {
        if (!userstate["user-id"]) return;
        let character = await services.character.getCharacterByUserHash(userstate["user-id"])

        if (!character) return;
        await services.character.addCoinToCharacter(character.id, 1)
    }
}

export default new AddCoinAction();