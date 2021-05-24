import tmi from 'tmi.js';
import ICommand from './ICommand';

export default interface ITwitchCommand extends ICommand {
    perform(
        client: tmi.Client,
        channel: string,
        tags: tmi.ChatUserstate,
        message: string
    ): void
}