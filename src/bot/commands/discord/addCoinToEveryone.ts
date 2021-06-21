import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import * as services from "../../services";

class AddCoinToEveryoneCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!give all \d+ coin/.test(text);
    }

    async perform(msg: Message) {
        let coin = Number(msg.content.split(" ")[2]);
        await services.character.addCoinToAllCharacter(coin);
        msg.channel.send(`ทำการเพิ่ม ${coin} coin ให้กับทุกคนแล้ว`);
    }
}

export default new AddCoinToEveryoneCommand();