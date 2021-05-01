import MessageCommander from './services/MessageCommander';
import DiscordPublisher from './services/DiscordPublisher';
import TwitchCommander from './services/TwitchPublisher';
import AbstractPublisher from '../abstracts/AbstractPublisher';
import IMessage from '../interfaces/IMessage';
import ISubscriber from '../interfaces/ISubscriber';
import requireAll from './utils/require-all';
import ICommand from '../interfaces/ICommand';
import Tearable from '../interfaces/Tearable';
import getConfigs from './utils/getConfigs';
import Config from '../interfaces/Configs';

export default class Bot implements Tearable {
    private publishers: AbstractPublisher<IMessage>[]
    private messageCommander: ISubscriber<IMessage>

    constructor() {
        let config: Config = getConfigs();
        this.publishers = [
            new DiscordPublisher(config.discord),
            new TwitchCommander(config.twitch)
        ]

        let commands: ICommand[] = Object.values(requireAll(__dirname + '/src/bot/commands'));
        this.messageCommander = new MessageCommander(commands);
        this.registerSubscriberToPublisher();
    }

    private registerSubscriberToPublisher(): void {
        this.publishers.map((publisher) => {
            publisher.register(this.messageCommander);
        })
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