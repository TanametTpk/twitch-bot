import { SlotMachineRewardSaved } from "@prisma/client";

export type SlotMachineWinningType = "mini" | "medium" | "big" | "none";

export interface SlotMachineRollingResult {
    isWin: boolean;
    winningType: SlotMachineWinningType;
    reward: number;
    result: number[];
}

export default interface ISlotMachineService {
    getCurrentReward(): Promise<Number>;
    addReward(reward: number): Promise<SlotMachineRewardSaved | null>;
    roll(): Promise<SlotMachineRollingResult>
    clearReward(): Promise<void>
} 