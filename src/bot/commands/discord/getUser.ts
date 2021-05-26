import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";

class GetUser implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!player status <name>";
    }

    perform(msg: Message): void {
        msg.channel.send("player status");
    }
}

export default new GetUser();