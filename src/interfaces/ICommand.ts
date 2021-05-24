
export default interface ICommand {
    match(text: string): boolean
}