
export type NotificationPlacement = "topLeft" | "topRight" | "bottomLeft" | "bottomRight"

export default interface IFeedApi {
    showFeed(message: string, placement: NotificationPlacement, duration: number): void
}