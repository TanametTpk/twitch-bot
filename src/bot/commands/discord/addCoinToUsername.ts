import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import * as services from "../../services";

class AddCoinToUsernameCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!give \d+ coin to [^ ]+/.test(text);
    }

    getHelp(): string {
        return "!give <amount> coin to <username>";
    }

    async perform(msg: Message) {
        let coin = Number(msg.content.split(" ")[1]);
        let username = msg.content.split(" ")[4]
        let character = await services.character.getCharacterByName(username);

        if (!character) return;

        services.character.addCoinToCharacter(character.id, coin)
        msg.channel.send(`ทำการเพิ่ม ${coin} coin ให้กับ ${username} แล้ว`);
    }
}

export default new AddCoinToUsernameCommand();