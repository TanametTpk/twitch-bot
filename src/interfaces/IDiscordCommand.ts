import Discord from 'discord.js';
import ICommand from './ICommand';

export default interface IDiscordCommand extends ICommand {
    perform(msg: Discord.Message): void
    getHelp(): string
}