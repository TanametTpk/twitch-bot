import AbstractPublisher from "../../abstracts/AbstractPublisher";
import tmi from 'tmi.js'
import client from '../twitch';
import ITwitchCommand from "../../interfaces/ITwitchCommand";
import IChannelPointAction from "../../interfaces/IChannelPointAction";
import IMiddleware from "../../interfaces/IMiddleware";
import ITwitchSubscriptionStategy from "../../interfaces/ITwitchSubscriptionStategy";
import ITwitchCheerStategy from "../../interfaces/ITwitchCheerStategy";

export default class TwitchCommander extends AbstractPublisher<ITwitchCommand> {
    private client: tmi.Client

    public constructor(
        commands: ITwitchCommand[],
        private rewardActions: IChannelPointAction[],
        private middlewareActions: IMiddleware[],
        private subscriptionStategy: ITwitchSubscriptionStategy,
        private cheerStatrgy: ITwitchCheerStategy
    ) {
        super(commands)
        this.client = client;
    }

    public start(): void {
        this.client.connect();

        this.client.on('subscription', (channel: string, username: string, _, message: string, userstate: tmi.SubUserstate) => {
            this.subscriptionStategy.perform(this.client, channel, message, username, userstate);
        })

        this.client.on("cheer", (channel: string, userstate: tmi.ChatUserstate, message: string) => {
            this.cheerStatrgy.perform(this.client, channel, userstate, message);
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
                    console.log(tags["custom-reward-id"]);
                }

                let rewardActionTasks = this.rewardActions.map(
                    async (action) => {
                        if (action.match(tags["custom-reward-id"]))
                            action.perform(this.client, channel, tags, message);
                    }
                )

                await Promise.all(rewardActionTasks)
            }

            let isCommandAvailable = process.env.AVALABLE_COMMAND === "true"
            if (isCommandAvailable) {
                const command = this.findMatchCommand(message);
                if (command) command.perform(
                    this.client,
                    channel,
                    tags,
                    message
                )
            }
        });
    }

    public stop(): void {
        this.client.disconnect()
    }
}