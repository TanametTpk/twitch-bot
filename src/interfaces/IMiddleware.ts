import tmi from 'tmi.js';

export default interface IMiddleware {
    perform(
        client: tmi.Client,
        channel: string,
        tags: tmi.ChatUserstate,
        message: string
    ): void
}