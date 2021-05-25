import IChannelPointAction from "../interfaces/IChannelPointAction";
import ICommand from "../interfaces/ICommand";
import Tearable from "../interfaces/Tearable";

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