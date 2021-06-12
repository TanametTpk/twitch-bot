import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import services from "../../services";

class RemoveCoinFromUsernameCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!remove \d+ coin from [^ ]+/.test(text);
    }

    async perform(msg: Message) {
        let coin = Number(msg.content.split(" ")[1]);
        let username = msg.content.split(" ")[4]
        let character = await services.character.getCharacterByName(username);

        if (!character) return;

        services.character.removeCoinFromCharacter(character.id, coin)
        msg.channel.send(`ทำการลบ ${coin} coin ของ ${username} แล้ว`);
    }
}

export default new RemoveCoinFromUsernameCommand();