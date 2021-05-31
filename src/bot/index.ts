import DiscordPublisher from './publishers/DiscordPublisher';
import TwitchPublisher from './publishers/TwitchPublisher';
import AbstractPublisher from '../abstracts/AbstractPublisher';
import requireAll from './utils/require-all';
import Tearable from '../interfaces/Tearable';
import IDiscordCommand from '../interfaces/IDiscordCommand';
import ITwitchCommand from '../interfaces/ITwitchCommand';
import IChannelPointAction from '../interfaces/IChannelPointAction';
import IMiddleware from '../interfaces/IMiddleware';
import SubscriptionReward from './stategies/SubscriptionReward';

export default class Bot implements Tearable {
    private publishers: AbstractPublisher<any>[]

    constructor() {
        let discordCommands: any = Object.values(requireAll(__dirname + '\\commands\\discord'));
        let twitchCommands: any = Object.values(requireAll(__dirname + '\\commands\\twitch'));
        let rewardActions: any = Object.values(requireAll(__dirname + '\\customRewards'));
        let middlewareActions: any = Object.values(requireAll(__dirname + '\\middlewares'));

        this.publishers = [
            new DiscordPublisher(discordCommands as IDiscordCommand[]),
            new TwitchPublisher(
                twitchCommands as ITwitchCommand[],
                rewardActions as IChannelPointAction[],
                middlewareActions as IMiddleware[],
                SubscriptionReward
            )
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