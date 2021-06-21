import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import NotEnoughCoinError from "../../errors/NotEnoughCoinError";
import NotFoundPotion from "../../errors/NotFoundPotion";
import * as services from "../../services";

class GetStatusCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        return /!potion [^ ]+/.test(text);
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        if (!tags["user-id"]) return;
        
        try {
            let potion: string = message.split(" ")[1]
            await services.shop.buyPotion(tags["user-id"], potion)
            client.say(channel, `${tags.username} ลืม ลืมฉันลืมไปก่อน`);
        } catch (error) {
            if (error instanceof NotEnoughCoinError) {
                client.say(channel, `${tags.username} อารายยยยย เงินไม่พอโว้ยยยย`);
            }

            if (error instanceof NotFoundPotion) {
                client.say(channel, `${tags.username} potion อะไรของเมิงงงงง บ้าป่ะเนี่ยยยยย`);
            }
        }
    }
}

export default new GetStatusCommand();