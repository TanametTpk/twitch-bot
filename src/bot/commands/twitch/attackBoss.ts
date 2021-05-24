import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";

export default class AttackBossCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        return text === "!attack boss";
    }

    perform(client: Client, channel: string, tags: ChatUserstate, message: string): void {
        throw new Error("Method not implemented.");

        // get player

        // attack boss

        // return message
    }
}