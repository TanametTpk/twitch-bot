import AbstractPublisher from "../../abstracts/AbstractPublisher";
import Discord from 'discord.js';
import client from '../discord';
import ICommand from "../../interfaces/ICommand";
import IDiscordCommand from "../../interfaces/IDiscordCommand";

export default class DiscordPublisher extends AbstractPublisher<IDiscordCommand> {
    private client: Discord.Client;
    
    public constructor(commands: IDiscordCommand []) {
        super(commands);
        this.client = client;
    }

    public start(): void {
        this.client.on('message', msg => {
            const command = this.findMatchCommand(msg.content);
            if (command) command.perform(msg)
        })

        this.client.login(process.env.DISCORD_OAUTH_TOKEN);
    }

    public stop(): void {
        this.client.destroy()
    }
}