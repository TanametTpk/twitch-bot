import AbstractPublisher from "../../abstracts/AbstractPublisher";
import IMessage from "../../interfaces/IMessage";
import Discord from 'discord.js'
import ICommand from "../../interfaces/ICommand";

export default class DiscordPublisher extends AbstractPublisher {
    private client: Discord.Client;
    
    public constructor(commands: ICommand[]) {
        super(commands);
        this.client = new Discord.Client();
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