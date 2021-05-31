import AbstractPublisher from "../../abstracts/AbstractPublisher";
import tmi from 'tmi.js'
import client from '../twitch';
import ITwitchCommand from "../../interfaces/ITwitchCommand";
import IChannelPointAction from "../../interfaces/IChannelPointAction";
import IMiddleware from "../../interfaces/IMiddleware";
import ITwitchSubscriptionStategy from "../../interfaces/ITwitchSubscriptionStategy";

export default class TwitchCommander extends AbstractPublisher<ITwitchCommand> {
    private client: tmi.Client
    private rewardActions: IChannelPointAction[]
    private middlewareActions: IMiddleware[]
    private subscriptionStategy: ITwitchSubscriptionStategy

    public constructor(
        commands: ITwitchCommand[],
        rewardActions: IChannelPointAction[],
        middlewareActions: IMiddleware[],
        subscriptionStategy: ITwitchSubscriptionStategy
    ) {
        super(commands)
        this.client = client;
        this.rewardActions = rewardActions;
        this.middlewareActions = middlewareActions;
        this.subscriptionStategy = subscriptionStategy
    }

    public start(): void {
        this.client.connect();

        this.client.on('subscription', (channel: string, username: string, _, message: string, userstate: tmi.SubUserstate) => {
            this.subscriptionStategy.perform(this.client, channel, message, userstate);
        })
        
        this.client.on('message', (channel, tags, message, self) => {            
            if (tags["custom-reward-id"]){
                this.rewardActions.map((action) => {
                    if (action.match(tags["custom-reward-id"]))
                        action.perform();
                })
            }

            this.middlewareActions.map(
                (middleware: IMiddleware) => 
                    middleware.perform(
                        this.client,
                        channel,
                        tags,
                        message
                    )
            )

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