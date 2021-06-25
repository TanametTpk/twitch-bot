import { ChatUserstate, Client } from "tmi.js";
import AbstractChannelPointAction from "../../abstracts/AbstractChannelPointAction";
import * as services from "../services";

class PotionAction extends AbstractChannelPointAction {
    constructor() {
        super("70408f72-cc86-40d3-886b-8c43cba95ec9");
    }

    async perform(client: Client, channel: string, userstate: ChatUserstate, message: string): Promise<void> {
        if (!userstate["user-id"]) return;
        
        try {
            // let potion: string = message
            await services.shop.buyPotion(userstate["user-id"], "ลืมไปก่อน")
            client.say(channel, `${userstate.username} ลืม ลืมฉันลืมไปก่อน`);
        } catch (error) {
            // if (error instanceof NotEnoughCoinError) {
            //     client.say(channel, `${tags.username} อารายยยยย เงินไม่พอโว้ยยยย`);
            // }

            // if (error instanceof NotFoundPotion) {
            //     client.say(channel, `${tags.username} potion อะไรของเมิงงงงง บ้าป่ะเนี่ยยยยย`);
        }
    }
}

export default new PotionAction();