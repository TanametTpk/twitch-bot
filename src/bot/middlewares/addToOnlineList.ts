import { Client, ChatUserstate } from "tmi.js";
import Player from "../../core/Player/Player";
import IMiddleware from "../../interfaces/IMiddleware";
import * as services from "../services";

class AddToOnlineListMiddleware implements IMiddleware {
    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        if (!tags["user-id"] || !tags.username) return;

        let player = services.game.getGameManager().playerManager.getPlayer(tags["user-id"])
        let character = await services.character.getCharacterByUserHash(tags["user-id"]);
        if (player && character) {
            player.setInfo(character)
            services.game.getGameManager().playerManager.addOnlinePlayer(player)
            return;
        }

        if (character) {
            if (character.user.name !== tags.username) {
                character.user.name = tags.username
                await services.user.changeName(character.user.id, character.user.name)
            }

            services.game.getGameManager().playerManager.addOnlinePlayer(new Player(character))
            return;
        }

        let user = await services.user.createUser(tags.username, tags["user-id"]);
        if (!user) {
            throw new Error("Can't not Create User");
        }

        let newCharacter = await services.character.createCharacter(user);
        if (!newCharacter) {
            throw new Error("Can't not Create Character");
        }

        character = await services.character.getCharacterById(newCharacter.id);
        if (!character) return;

        services.game.getGameManager().playerManager.addOnlinePlayer(new Player(character))
    }
}

export default new AddToOnlineListMiddleware();