import AbstractPublisher from "../../abstracts/AbstractPublisher";
import tmi from 'tmi.js'
import client from '../twitch';
import ITwitchCommand from "../../interfaces/ITwitchCommand";
import ICommand from "../../interfaces/ICommand";

export default class TwitchCommander extends AbstractPublisher<ITwitchCommand> {
    private client: tmi.Client

    public constructor(commands: ITwitchCommand[]) {
        super(commands)
        this.client = client;
    }

    public start(): void {
        this.client.connect();

        this.client.on('message', (channel, tags, message, self) => {
            const command = this.findMatchCommand(message);
            if (command) command.perform(
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