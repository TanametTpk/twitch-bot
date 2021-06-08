import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import services from "../../services";

class SpellCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        return /!spell [^ ]+/.test(text);
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        if (!tags["user-id"]) return;

        let character = await services.character.getCharacterByUserHash(tags["user-id"])
        if (!character) throw new Error("can't find character, have something wrong in this system!!")

        let spellName = message.split(" ")[1]
        client.say(channel, `
            @${tags.username} do something
        `)
    }
}

export default new SpellCommand();