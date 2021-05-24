import AbstractPublisher from "../../abstracts/AbstractPublisher";
import Discord from 'discord.js';
import client from '../discord';
import ICommand from "../../interfaces/ICommand";

export default class DiscordPublisher extends AbstractPublisher {
    private client: Discord.Client;
    
    public constructor(commands: ICommand[]) {
        super(commands);
        this.client = client;
    }

    public start(): void {
        this.client.on('message', msg => {
            const command = this.findMatchCommand(msg.content);
            if (command) command.discordPerform(msg)
        })

        this.client.login(process.env.DISCORD_OAUTH_TOKEN);
    }

    public stop(): void {
        this.client.destroy()
    }
}