export default interface ISubscriber<T> {
    receive(messages: T): void
}