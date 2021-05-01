import IMessage from "./IMessage";

export default interface ICommand {
    match(text: string): boolean
    perform(message: IMessage): void
}