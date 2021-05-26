import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";

class AttackPlayer implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!player pvp <name>";
    }

    perform(msg: Message): void {
        msg.channel.send("<name> was attacked by this player");
    }
}

export default new AttackPlayer();