import AbstractPublisher from "../../abstracts/AbstractPublisher";
import IMessage from "../../interfaces/IMessage";
import Discord from 'discord.js'
import { DiscordConfig } from "../../interfaces/Configs";

export default class DiscordPublisher extends AbstractPublisher<IMessage> {
    private token: string;
    private client: Discord.Client;
    
    public constructor(config: DiscordConfig) {
        super();
        this.token = config.token;
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

        this.client.login(this.token);
    }

    public stop(): void {
        this.client.destroy()
    }
}