import { ChatUserstate, Client } from "tmi.js";
import ITwitchCheerStategy from "../../interfaces/ITwitchCheerStategy";
import * as services from "../services";

class CheerRewardStategy implements ITwitchCheerStategy {
    async perform(client: Client, channel: string, userstate: ChatUserstate, message: string): Promise<void> {
        if (!userstate["user-id"] || !userstate.bits) return;
        let character = await services.character.getCharacterByUserHash(userstate["user-id"])
        if (!character) return;

        let bits = Number(userstate.bits)
        let rewardCoin = Number(process.env.REWARD_FOR_PEOPLE_WHO_CHEER_YOU) || 12
        let shareRewardCoin = Number(process.env.SHARE_REWARD_WHEN_GOT_CHEER) || 1
        let rewardRatio = Number(process.env.GIVE_REWARD_WHEN_RECEIVED_CHEER_NUMBER_OF) ||200
        if (character.user.cheer + bits >= rewardRatio) {
            let numberOfReward = Math.floor((character.user.cheer + bits) / rewardRatio)
            await services.character.addCoinToCharacter(character.id, (rewardCoin - shareRewardCoin) * numberOfReward);
            await services.character.addCoinToAllCharacter(shareRewardCoin * numberOfReward);
            await services.user.removeCheerReward(character.userId, character.user.cheer)
            let remainBit = (character.user.cheer + bits) % rewardRatio

            client.say(channel, `
                @${userstate.username} bits ครบ ${rewardRatio} แล้ว ท่านได้รับ ${rewardCoin} coin และแบ่งให้ทุกคนอีก ${shareRewardCoin} coin
            `)

            if (remainBit > 0) {
                await services.user.addCheerReward(character.userId, remainBit)
            }
        } else {
            await services.user.addCheerReward(character.userId, bits)
        }
    }
}

export default new CheerRewardStategy()