import IPublisher from "../interfaces/IPublisher";
import ISubscriber from "../interfaces/ISubscriber";
import Tearable from "../interfaces/Tearable";

export default abstract class AbstractPublisher<T> implements IPublisher<T>, Tearable {
    private subscribers: ISubscriber<T>[] = [];

    public register(subscriber: ISubscriber<T>): void {
        this.subscribers.push(subscriber);
    }

    public publish(data: T): void {
        this.subscribers.map((subscriber: ISubscriber<T>) => {
            subscriber.receive(data);
        })
    }

    public abstract start(): void

    public abstract stop(): void
}