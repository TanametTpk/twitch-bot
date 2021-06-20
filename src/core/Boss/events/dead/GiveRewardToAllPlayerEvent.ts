import  * as services from "../../../../bot/services";
import client from "../../../../bot/twitch";
import getUniqueNumber from "../../../../bot/utils/getUniqueNumber";
import roll from "../../../../bot/utils/roll";
import ICharacterService from "../../../../interfaces/services/ICharacterService";
import { BattleInfo } from "../../../battle/BossBattleSystem";
import IBossDeadEvent from "../../../interfaces/Boss/IBossDeadEvent";
import Player from "../../../Player/Player";

interface Reward {
    characterId: number
    coin: number
}

export default class GiveRewardToAllPlayerEvent implements IBossDeadEvent {
    private characterService: ICharacterService

    constructor() {
        this.characterService = services.character
    }

    private getTopFivePlayer(info: BattleInfo[]): Player[] {
        let allDamageNumber: number[] = info.map((battleInfo) => battleInfo.damage)

        let uniqueDamageNumber = getUniqueNumber(allDamageNumber)
        let topFiveDmg: number[] = uniqueDamageNumber
                                    .sort((a, b) => b - a)
                                    .slice(0,5);
        
        let topTierPlayerIdList: Player[] = []
        for (const battleInfo of info) {
            if (topFiveDmg.includes(battleInfo.damage)) {
                topTierPlayerIdList.push(battleInfo.player);
            }
        }

        return topTierPlayerIdList;
    }

    private isPlayerInList(list: Player[], target: Player): boolean {
        return list.some((player) => player.getId() === target.getId())
    }

    private async distributeRewards(rewards: Reward[]): Promise<any> {
        return rewards.map((reward) => {
            this.characterService.addCoinToCharacter(reward.characterId, reward.coin);
        })
    }

    private showUsers(header: string, playerList: Player[]): void {
        client.say(process.env.tmi_channel_name as string, `--- ${header} ---`)
        let text = ""
        for (let player of playerList) {
            let username = player.getInfo().user.name
            text += `<${username}>`
        }
        client.say(process.env.tmi_channel_name as string, text)
    }

    async do(info: BattleInfo[]) {
        let topFiveDmgPlayer: Player[] = this.getTopFivePlayer(info);
        let luckyList: Player[] = []
        let createRewards: Promise<Reward>[] = info.map(async(battleInfo) => {
            let isExtraReward = roll(5)
            let player = battleInfo.player
            let reward: number = isExtraReward ? 2 : 1;
            let isTopFivePlayer = this.isPlayerInList(topFiveDmgPlayer, player)

            if (isTopFivePlayer) reward = 3;
            if (isExtraReward && !isTopFivePlayer) {
                luckyList.push(player)
            }

            return {
                characterId: player.getInfo().id,
                coin: reward
            }
        })

        let rewards: Reward[] = await Promise.all(createRewards);
        await this.distributeRewards(rewards);

        client.say(process.env.tmi_channel_name as string, `บอสถูกกำจัดแล้ว เอารางวัลไปซะเหล่านักพจญภัย`)
        this.showUsers("Top 5 Most Damage", topFiveDmgPlayer)

        if (luckyList.length > 0) {
            this.showUsers("Most Lucky", luckyList)
        }
    }
}