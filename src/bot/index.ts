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
        let commands: any = Object.values(requireAll(__dirname + '\\commands'));
        this.publishers = [
            new DiscordPublisher(commands["discord"] as IDiscordCommand[]),
            new TwitchCommander(commands["twitch"] as ITwitchCommand[])
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