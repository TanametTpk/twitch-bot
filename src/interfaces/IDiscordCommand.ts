import Discord from 'discord.js';

export default interface IDiscordCommand {
    perform(msg: Discord.Message): void
}