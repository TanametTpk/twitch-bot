import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import IGameService from "../../../interfaces/services/IGameService";
import services from "../../services";

class AttackPlayerCommand implements ICommand, ITwitchCommand {
    match(text: string): boolean {
        // return false;
        return /!pvp [^ ]+/.test(text);
    }

    perform(client: Client, channel: string, tags: ChatUserstate, message: string): void {
        let nameTag = message.split(" ")[1]
        let name = nameTag.substring(1)
        console.log(name);
        
        // let game: IGameService = services.game;
        // let params = message.split(" ");
        // let attackedName = params[1];

        // // find attacker
        // let attackerPlayer = ""

        // // find by name
        // let attackedPlayer = ""

        // game.pvp(attackerId, attackedId);
        // client.say(channel, `@${attackedName} ถูกกระทืบโดย ${tags.username}`);
    }
}

export default new AttackPlayerCommand();