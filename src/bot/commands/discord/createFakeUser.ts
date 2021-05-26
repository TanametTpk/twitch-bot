import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";

class CreateFakeUser implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!player create <name>";
    }

    perform(msg: Message): void {
        msg.channel.send("player <name> created with status");
    }
}

export default new CreateFakeUser();