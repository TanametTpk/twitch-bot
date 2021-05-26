import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";

class AttackBoss implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!player att boss";
    }

    perform(msg: Message): void {
        msg.channel.send("boss was attacked by player");
    }
}

export default new AttackBoss();