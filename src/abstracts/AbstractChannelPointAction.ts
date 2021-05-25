import IChannelPointAction from "../interfaces/IChannelPointAction";

export default abstract class AbstractChannelPointAction implements IChannelPointAction {
    private id: string;

    constructor(customRewardId: string) {
        this.id = customRewardId;
    }

    match(customRewardId: string): boolean {
        return this.id === customRewardId;
    }

    abstract perform(): void
}