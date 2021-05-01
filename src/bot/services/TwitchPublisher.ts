import AbstractPublisher from "../../abstracts/AbstractPublisher";
import IMessage from "../../interfaces/IMessage";
import tmi from 'tmi.js'

export default class TwitchCommander extends AbstractPublisher<IMessage> {
    private client: tmi.Client

    public constructor(channel_name: string) {
        super()
        this.client = new tmi.Client({
            connection: { reconnect: true },
            channels: [ channel_name ]
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