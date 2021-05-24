import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";

class AttackPlayerCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        return text === "!attack player <string>";
    }

    perform(client: Client, channel: string, tags: ChatUserstate, message: string): void {
        // get attacker player
        // get attacked player

        // attack

        // check death and mute

        // send msg
    }
}

export default new AttackPlayerCommand();