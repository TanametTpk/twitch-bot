import AbstractPublisher from "../../abstracts/AbstractPublisher";
import IMessage from "../../interfaces/IMessage";
import tmi from 'tmi.js'

export default class TwitchCommander extends AbstractPublisher<IMessage> {
    private client: tmi.Client

    public constructor() {
        super()
        this.client = new tmi.Client({
            options: {
                debug: [undefined, 'development'].includes(process.env.NODE_ENV),
            },
            connection: { reconnect: true },
            identity: {
                username: process.env.tmi_username,
                password: process.env.TWITCH_OAUTH_TOKEN,
            },
            channels: [process.env.tmi_channel_name as string],
        })
    }

    public start(): void {
        this.client.connect();

        this.client.on('message', (channel, tags, message, self) => {
            let chat: IMessage = {
                userId: tags["user-id"] || "unknows",
                username: tags.username || "unknows",
                message
            }
            this.publish([chat])
        });
    }

    public stop(): void {
        this.client.disconnect()
    }
}