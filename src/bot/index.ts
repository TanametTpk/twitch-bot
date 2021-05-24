import DiscordPublisher from './publishers/DiscordPublisher';
import TwitchCommander from './publishers/TwitchPublisher';
import AbstractPublisher from '../abstracts/AbstractPublisher';
import requireAll from './utils/require-all';
import Tearable from '../interfaces/Tearable';
import IDiscordCommand from '../interfaces/IDiscordCommand';
import ITwitchCommand from '../interfaces/ITwitchCommand';

export default class Bot implements Tearable {
    private publishers: AbstractPublisher<any>[]

    constructor() {
        let discordCommands: any = Object.values(requireAll(__dirname + '\\commands\\discord'));
        let twitchCommands: any = Object.values(requireAll(__dirname + '\\commands\\twitch'));

        this.publishers = [
            new DiscordPublisher(discordCommands as IDiscordCommand[]),
            // new TwitchCommander(twitchCommands as ITwitchCommand[])
        ]
    }

    public start(): void {
        this.publishers.map((publisher) => {
            publisher.start();
        })
    }

    public stop(): void {
        this.publishers.map((publisher) => {
            publisher.stop();
        })
    }

}