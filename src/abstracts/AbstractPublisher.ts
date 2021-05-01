import IPublisher from "../interfaces/IPublisher";
import ISubscriber from "../interfaces/ISubscriber";
import Tearable from "../interfaces/Tearable";

export default abstract class AbstractPublisher<T> implements IPublisher<T>, Tearable {
    private subscribers: ISubscriber<T>[] = [];

    public register(subscriber: ISubscriber<T>): void {
        this.subscribers.push(subscriber);
    }

    public publish(messages: T[]): void {
        this.subscribers.map((subscriber: ISubscriber<T>) => {
            messages.map((message) => subscriber.receive(message));
        })
    }

    public abstract start(): void

    public abstract stop(): void
}