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
            this.subscriptionStategy.perform(this.client, channel, message, username, userstate);
        })
        
        this.client.on('message', async(channel, tags, message, self) => {            
            let middlewareTasks = this.middlewareActions.map(
                async (middleware: IMiddleware) => 
                    middleware.perform(
                        this.client,
                        channel,
                        tags,
                        message
                    )
            )

            await Promise.all(middlewareTasks)

            if (tags["custom-reward-id"]){
                if (process.env.DEBUG_CUSTOM_REWARD) {
                    console.debug(tags["custom-reward-id"]);
                }

                let rewardActionTasks = this.rewardActions.map(
                    async (action) => {
                        if (action.match(tags["custom-reward-id"]))
                            action.perform(this.client, channel, tags, message);
                    }
                )

                await Promise.all(rewardActionTasks)
            }

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