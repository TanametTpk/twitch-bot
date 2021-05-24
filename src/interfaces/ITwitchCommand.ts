import tmi from 'tmi.js';

export default interface ITwitchCommand {
    perform(
        client: tmi.Client,
        channel: string,
        tags: tmi.ChatUserstate,
        message: string
    ): void
}