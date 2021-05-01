import AbstractPublisher from "../../abstracts/AbstractPublisher";
import tmi from 'tmi.js'
import ICommand from "../../interfaces/ICommand";

export default class TwitchCommander extends AbstractPublisher {
    private client: tmi.Client

    public constructor(commands: ICommand[]) {
        super(commands)
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
            const command = this.findMatchCommand(message);
            if (command) command.twitchPerform(
                this.client,
                channel,
                tags,
                message
            )
        });
    }

    public stop(): void {
        this.client.disconnect()
    }
}