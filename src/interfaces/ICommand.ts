import IMessage from "./IMessage";
import Discord from 'discord.js';
import tmi from 'tmi.js';

export default interface ICommand {
    match(text: string): boolean
    perform(message: IMessage): void
    discordPerform(msg: Discord.Message): void
    twitchPerform(
        client: tmi.Client,
        channel: string,
        tags: tmi.ChatUserstate,
        message: string
    ): void
}