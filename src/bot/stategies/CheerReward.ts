import { ChatUserstate, Client } from "tmi.js";
import ITwitchCheerStategy from "../../interfaces/ITwitchCheerStategy";
import * as services from "../services";

class CheerRewardStategy implements ITwitchCheerStategy {
    async perform(client: Client, channel: string, userstate: ChatUserstate, message: string): Promise<void> {
        if (!userstate["user-id"] || !userstate.bits) return;
        let character = await services.character.getCharacterByUserHash(userstate["user-id"])
        if (!character) return;

        let bits = Number(userstate.bits)
        let rewardCoin = 12
        let shareRewardCoin = 1
        if (character.user.cheer + bits >= 500) {
            let numberOfReward = Math.floor((character.user.cheer + bits) / 500)
            await services.character.addCoinToCharacter(character.id, (rewardCoin - shareRewardCoin) * numberOfReward);
            await services.character.addCoinToAllCharacter(shareRewardCoin * numberOfReward);
            await services.user.removeCheerReward(character.userId, character.user.cheer)
            let remainBit = (character.user.cheer + bits) % 500

            client.say(channel, `
                @${userstate.username} bits ครบ 500 แล้ว ท่านได้รับ 12 coin
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