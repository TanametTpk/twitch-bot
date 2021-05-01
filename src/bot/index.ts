import DiscordPublisher from './services/DiscordPublisher';
import TwitchCommander from './services/TwitchPublisher';
import AbstractPublisher from '../abstracts/AbstractPublisher';
import requireAll from './utils/require-all';
import ICommand from '../interfaces/ICommand';
import Tearable from '../interfaces/Tearable';

export default class Bot implements Tearable {
    private publishers: AbstractPublisher[]

    constructor() {
        let commands: ICommand[] = Object.values(requireAll(__dirname + '/src/bot/commands'));
        this.publishers = [
            new DiscordPublisher(commands),
            new TwitchCommander(commands)
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