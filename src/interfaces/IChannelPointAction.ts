export default interface IChannelPointAction {
    match(customRewardId: string): boolean
    perform(): void
}