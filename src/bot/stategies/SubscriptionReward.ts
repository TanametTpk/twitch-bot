import { Client, SubUserstate } from "tmi.js";
import ITwitchSubscriptionStategy from "../../interfaces/ITwitchSubscriptionStategy";
import services from "../services";

class SubscriptionRewardStategy implements ITwitchSubscriptionStategy {
    async perform(client: Client, channel: string, message: string, username: string, userstate: SubUserstate): Promise<void> {
        if (!userstate["user-id"]) return;
        let character = await services.character.getCharacterByUserHash(userstate["user-id"])
        if (!character) return;

        await services.character.addCoinToCharacter(character.id, 9);
        await services.character.addCoinToAllCharacter(1);
    }
}

export default new SubscriptionRewardStategy()