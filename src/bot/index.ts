import DiscordPublisher from './publishers/DiscordPublisher';
import TwitchCommander from './publishers/TwitchPublisher';
import AbstractPublisher from '../abstracts/AbstractPublisher';
import requireAll from './utils/require-all';
import Tearable from '../interfaces/Tearable';
import IDiscordCommand from '../interfaces/IDiscordCommand';
import ITwitchCommand from '../interfaces/ITwitchCommand';
import IChannelPointAction from '../interfaces/IChannelPointAction';

export default class Bot implements Tearable {
    private publishers: AbstractPublisher<any>[]

    constructor() {
        let discordCommands: any = Object.values(requireAll(__dirname + '\\commands\\discord'));
        let twitchCommands: any = Object.values(requireAll(__dirname + '\\commands\\twitch'));
        let rewardActions: any = Object.values(requireAll(__dirname + '\\customRewards'));

        this.publishers = [
            new DiscordPublisher(discordCommands as IDiscordCommand[]),
            new TwitchCommander(twitchCommands as ITwitchCommand[], rewardActions as IChannelPointAction[])
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