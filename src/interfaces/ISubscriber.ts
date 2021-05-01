export default interface ISubscriber<T> {
    receive(data: T): void
}