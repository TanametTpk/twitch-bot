import tmi, { Client } from "tmi.js";
import ITwitchMysteryGift from "../../interfaces/ITwitchMysteryGift";
import * as services from "../services";

// not use this because it's repeat logic to SubscriptionReward
// but if we have to switch to other pattern
// we may have to use this later!
class SubGiftingReward implements ITwitchMysteryGift {
    async perform(client: Client, channel: string, username: string, numbOfSubs: number, methods: tmi.SubMethods, userstate: tmi.SubMysteryGiftUserstate): Promise<void> {
        if (!userstate["user-id"]) return;
        let character = await services.character.getCharacterByUserHash(userstate["user-id"])
        if (!character) return;

        let rewardCoin = Number(process.env.WHEN_SUB_GIVE_REWARD) || 10
        let shareRewardCoin = Number(process.env.SHARE_REWARD_WHEN_GOT_SUB) || 1
        let plan = userstate["msg-param-sub-plan"]
        if (plan) {
            if (plan === '2000') rewardCoin = rewardCoin * (Number(process.env.SUB_TIER_TWO_MULTIPLY) || 2)
            if (plan === '3000') rewardCoin = rewardCoin * (Number(process.env.SUB_TIER_THREE_MULTIPLY) || 4)
        }

        await services.character.addCoinToCharacter(character.id, rewardCoin - shareRewardCoin);
        await services.character.addCoinToAllCharacter(shareRewardCoin);

        client.say(channel, `
            @${username} ได้รับ ${rewardCoin} coin จากการซับ
        `)

        client.say(channel, `
            @${username} ได้อุทิศส่วนบุญให้ทุกคนอีก ${shareRewardCoin} coin
        `)
    }
}

export default new SubGiftingReward()