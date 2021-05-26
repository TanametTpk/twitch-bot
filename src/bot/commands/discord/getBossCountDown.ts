import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";

class GetBossCountDown implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!boss countdown";
    }

    perform(msg: Message): void {
        msg.channel.send("time: run out");
    }
}

export default new GetBossCountDown();