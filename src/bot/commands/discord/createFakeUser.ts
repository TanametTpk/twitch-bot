import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import * as services from "../../services";

class CreateFakeUserCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!player create [a-zA-Z0-9]+/.test(text);
    }

    getHelp(): string {
        return "!player create <username> - Creates a fake player with the given username";
    }

    async perform(msg: Message) {
        let name = msg.content.split(" ")[2];
        let user = await services.user.createUser(name, `${Math.random()}`)

        if (!user) {
            msg.channel.send(`can't create user`)
            return
        }

        let character = await services.character.createCharacter(user);

        if (!character) {
            msg.channel.send(`can't create character`)
            return
        }

        msg.channel.send(`สร้าง User(${user.hash}) เสร็จแล้ว!`);
    }
}

export default new CreateFakeUserCommand();