import AbstractPublisher from "../../abstracts/AbstractPublisher";
import IMessage from "../../interfaces/IMessage";
import Discord from 'discord.js'

export default class DiscordPublisher extends AbstractPublisher<IMessage> {
    private client: Discord.Client;
    
    public constructor() {
        super();
        this.client = new Discord.Client();
    }

    public start(): void {
        this.client.on('message', msg => {
            let chat: IMessage = {
                userId: msg.author.id,
                username: msg.author.username,
                message: msg.content
            }

            this.publish([chat]);
        })

        this.client.login(process.env.DISCORD_OAUTH_TOKEN);
    }

    public stop(): void {
        this.client.destroy()
    }
}