import AbstractPublisher from "../../abstracts/AbstractPublisher";
import tmi from 'tmi.js'
import client from '../twitch';
import ITwitchCommand from "../../interfaces/ITwitchCommand";
import IChannelPointAction from "../../interfaces/IChannelPointAction";

export default class TwitchCommander extends AbstractPublisher<ITwitchCommand> {
    private client: tmi.Client
    private rewardActions: IChannelPointAction[]

    public constructor(commands: ITwitchCommand[], rewardActions: IChannelPointAction[]) {
        super(commands)
        this.client = client;
        this.rewardActions = rewardActions;
    }

    public start(): void {
        this.client.connect();
        console.log("start twitch");
        
        this.client.on('message', (channel, tags, message, self) => {
            console.log(tags);
            
            if (tags["custom-reward-id"]){
                this.rewardActions.map((action) => {
                    if (action.match(tags["custom-reward-id"]))
                        action.perform();
                })
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