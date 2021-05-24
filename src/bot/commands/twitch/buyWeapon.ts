import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";

class BuyWeaponCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        return text === "!buy <int>";
    }

    perform(client: Client, channel: string, tags: ChatUserstate, message: string): void {
        // calculate damage

        // set item
    }
}

export default new BuyWeaponCommand();