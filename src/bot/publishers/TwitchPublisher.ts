import AbstractPublisher from "../../abstracts/AbstractPublisher";
import tmi, { ChatUserstate } from 'tmi.js'
import client from '../twitch';
import ITwitchCommand from "../../interfaces/ITwitchCommand";
import IChannelPointAction from "../../interfaces/IChannelPointAction";
import IMiddleware from "../../interfaces/IMiddleware";
import ITwitchSubscriptionStategy from "../../interfaces/ITwitchSubscriptionStategy";
import ITwitchCheerStategy from "../../interfaces/ITwitchCheerStategy";
import { PubSubClient, PubSubListener } from "twitch-pubsub-client";
import { StaticAuthProvider } from "twitch-auth";
import { ApiClient } from "twitch";

export default class TwitchCommander extends AbstractPublisher<ITwitchCommand> {
    private client: tmi.Client
    private pubSubClient: PubSubClient = new PubSubClient();
    private userId: any;
    private listener: PubSubListener<never> | undefined;
    private apiClient: ApiClient;

    public constructor(
        commands: ITwitchCommand[],
        private rewardActions: IChannelPointAction[],
        private middlewareActions: IMiddleware[],
        private subscriptionStategy: ITwitchSubscriptionStategy,
        private cheerStatrgy: ITwitchCheerStategy
    ) {
        super(commands)
        this.client = client;
        let clientId = process.env.TWITCH_CLIENT_ID || ""
        let accessToken = process.env.TWITCH_CLIENT_ACCESS_TOKEN || ""
        
        let authProvider = new StaticAuthProvider(clientId, accessToken)
        this.apiClient = new ApiClient({ authProvider })
    }

    public start(): void {
        this.client.connect();

        this.registerPubSub();

        this.client.on('subscription', (channel: string, username: string, _, message: string, userstate: tmi.SubUserstate) => {
            this.subscriptionStategy.perform(this.client, channel, message, username, userstate);
        })

        this.client.on('submysterygift', (channel: string, username: string, numbOfSubs: number, methods: tmi.SubMethods, userstate: tmi.SubMysteryGiftUserstate) => {
            // use same code
            // Userstate may have side effect when parse SubMysteryGiftUserstate to SubUserstate
            this.subscriptionStategy.perform(this.client, channel, "", username, userstate as tmi.SubUserstate)
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

    private async registerPubSub() {
        this.userId = await this.pubSubClient.registerUserListener(this.apiClient)

        this.listener = await this.pubSubClient.onRedemption({id: this.userId}, async (msg) => {
            let channel = process.env.tmi_channel_name as string
            // *THIS IS FAKE STATE FOR REUSE FROM TMIJS*
            let tags: ChatUserstate = {
                badges: {},
                color: "",
                'display-name': msg.userDisplayName,
                'emotes': {},
                'mod': false,
                'room-id': '',
                'subscriber': false,
                'turbo': false,
                'user-id': msg.userId,
                'user-type': '',
                'emotes-raw': '',
                "badges-raw": '',
                'username': msg.userName,
                'message-type': 'action',
                'custom-reward-id': msg.rewardId
            } as ChatUserstate
            let message: string = msg.message
            
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

                let rewardActionTasks = this.rewardActions
                    .filter((action: IChannelPointAction) => !action.getIsNeedMessage())
                    .map(
                        async (action) => {
                            if (action.match(tags["custom-reward-id"]))
                                action.perform(this.client, channel, tags, message);
                        }
                    )

                await Promise.all(rewardActionTasks)
            }

            let isCommandAvailable = process.env.AVALABLE_COMMAND === "true"
            if (isCommandAvailable && message) {
                const command = this.findMatchCommand(message);
                if (command) command.perform(
                    this.client,
                    channel,
                    tags,
                    message
                )
            }
        })

        console.log("Finish Listen to PubSub");
    }

    public stop(): void {
        this.client.disconnect()
        this.listener?.remove()
    }
}