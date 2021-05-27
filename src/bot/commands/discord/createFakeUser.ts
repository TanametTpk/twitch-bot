import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import CharacterService from "../../services/CharacterService";
import UserService from "../../services/UserService";

class CreateFakeUserCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return text === "!player create <name>";
    }

    async perform(msg: Message) {
        let name = msg.content.split(" ")[2];
        let user = await UserService.createUser(name, `${Math.random()}`)

        if (!user) {
            msg.channel.send(`can't create user`)
            return
        }

        let character = await CharacterService.createCharacter(user);

        if (!character) {
            msg.channel.send(`can't create character`)
            return
        }

        msg.channel.send(`สร้าง User(${user.hash}) เสร็จแล้ว!`);
    }
}

export default new CreateFakeUserCommand();