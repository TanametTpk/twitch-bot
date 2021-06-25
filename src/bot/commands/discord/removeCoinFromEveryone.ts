import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import * as services from "../../services";

class RemoveCoinFromEveryoneCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!remove all \d+ coin/.test(text);
    }

    async perform(msg: Message) {
        let coin = Number(msg.content.split(" ")[2]);
        await services.character.removeCoinFromAllCharacter(coin);
        msg.channel.send(`ทำการยึด ${coin} coin จากทุกคนแล้ว`);
    }
}

export default new RemoveCoinFromEveryoneCommand();