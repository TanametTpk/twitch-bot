import { Message } from "discord.js";
import ICommand from "../../../interfaces/ICommand";
import IDiscordCommand from "../../../interfaces/IDiscordCommand";
import services from "../../services";

class FindUserByNameCommand implements ICommand, IDiscordCommand {
    match(text: string): boolean {
        return /!info of [^ ]+/.test(text);
    }

    async perform(msg: Message) {
        let username = msg.content.split(" ")[2]
        let character = await services.character.getCharacterByName(username);
        if (!character) return;

        let playerManager = services.game.getGameManager().playerManager
        let isDead = playerManager.isPlayerDead(character.user.hash)
        msg.channel.send(`
            -- user --
            id: ${character.user.id}
            hash: ${character.user.hash}
            name: ${character.user.name}
            cheer: ${character.user.cheer}
            -- character --
            id: ${character.id}
            coin: ${character.coin}
            base atk: ${character.atk}
            equipment: ${character.equipment}
            isDead: ${isDead}
        `);
    }
}

export default new FindUserByNameCommand();