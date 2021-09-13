import { Character, PrismaClient, SlotMachineRewardSaved } from "@prisma/client";
import ICharacterService from "../../interfaces/services/ICharacterService";
import ISlotMachineService, { SlotMachineRollingResult, SlotMachineWinningType } from "../../interfaces/services/ISlotMachineService";
import randomIntBetween from "../utils/randomIntBetween";

class SlotMachineService implements ISlotMachineService {
    private client: PrismaClient
    private characterService: ICharacterService

    constructor(client: PrismaClient, characterService: ICharacterService) {
        this.client = client;
        this.characterService = characterService;
    }

    async getCurrentReward(): Promise<number> {
        let record: SlotMachineRewardSaved | null = await this.client.slotMachineRewardSaved.findFirst({
            orderBy: {
                created_at: "desc"
            }
        });

        if (record)
            return record.cumurative_reward;
        return 100;
    }

    async addReward(reward: number): Promise<SlotMachineRewardSaved | null> {
        let lastest_rewards = await this.getCurrentReward()
        return this.client.slotMachineRewardSaved.create({
            data: {
                cumurative_reward: lastest_rewards + reward,
                created_at: new Date()
            }
        });
    }

    async roll(): Promise<SlotMachineRollingResult> {
        let result: number[] = []

        for (let i = 0; i < 3; i++) {
            result.push(randomIntBetween(0, 9))
        }

        let winning_type = this.checkWinningType(result)
        let reward = await this.getReward(winning_type)

        return {
            isWin: winning_type !== "none",
            winningType: winning_type,
            reward: reward,
            result: [9, 9, 9]
        }
    }

    private async getReward(winning_type: SlotMachineWinningType): Promise<number> {
        if (winning_type === "big") {
            let lastest_rewards = await this.getCurrentReward()
            return lastest_rewards
        }

        if (winning_type === "medium") {
            return 25
        }

        if (winning_type === "mini") {
            return 10
        }

        return 0
    }

    private checkWinningType(result: number[]): SlotMachineWinningType {
        // more than 6 just once, you get reward.
        if (result[0] > 6 || result[1] > 6 || result[2] > 6) {
            if (result[0] === result[1] && result[1] === result[2]) {
                return "big"
            } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
                return "medium"
            }

            return "mini"
        }

        return "none"
    }

    async clearReward(): Promise<void> {
        await this.client.slotMachineRewardSaved.deleteMany({});
    }
}

export default SlotMachineService;