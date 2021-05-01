import AbstractPublisher from "../../abstracts/AbstractPublisher";
import IMessage from "../../interfaces/IMessage";


export default class TwitchCommander extends AbstractPublisher<IMessage> {
    public start(): void {
        throw new Error("Method not implemented.");
    }

    public stop(): void {
        throw new Error("Method not implemented.");
    }
}