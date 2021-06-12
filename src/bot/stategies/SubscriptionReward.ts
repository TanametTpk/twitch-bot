import { Client, SubUserstate } from "tmi.js";
import ITwitchSubscriptionStategy from "../../interfaces/ITwitchSubscriptionStategy";
import services from "../services";

class SubscriptionRewardStategy implements ITwitchSubscriptionStategy {
    async perform(client: Client, channel: string, message: string, username: string, userstate: SubUserstate): Promise<void> {
        if (!userstate["user-id"]) return;
        let character = await services.character.getCharacterByUserHash(userstate["user-id"])
        if (!character) return;

        let rewardCoin = 10
        let shareRewardCoin = 1
        let plan = userstate["msg-param-sub-plan"]
        if (plan) {
            if (plan === '2000') rewardCoin = rewardCoin * 2
            if (plan === '3000') rewardCoin = rewardCoin * 4
        }

        await services.character.addCoinToCharacter(character.id, rewardCoin - shareRewardCoin);
        await services.character.addCoinToAllCharacter(shareRewardCoin);
    }
}

export default new SubscriptionRewardStategy()