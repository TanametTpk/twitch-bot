import ISubscriber from "./ISubscriber";

export default interface IPublisher<T> {
    register(subscriber: ISubscriber<T>): void
    publish(messages: T[]): void
}