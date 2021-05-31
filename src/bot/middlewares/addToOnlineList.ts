import { Client, ChatUserstate } from "tmi.js";
import IMiddleware from "../../interfaces/IMiddleware";
import services from "../services";

class AddToOnlineListMiddleware implements IMiddleware {
    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        if (!tags["user-id"] || !tags.username) return;
        if (services.game.isPlayerOnline(tags["user-id"])) return;

        let user = await services.user.getUserByHash(tags["user-id"]);
        if (user) {
            services.game.getGameManager().playerManager.addOnlinePlayer(user)
            return;
        }

        user = await services.user.createUser(tags.username, tags["user-id"]);
        if (!user) {
            throw new Error("Can't not Create User");
        }

        let character = await services.character.createCharacter(user);
        if (!character) {
            throw new Error("Can't not Create Character");
        }

        services.game.getGameManager().playerManager.addOnlinePlayer(user)
    }
}

export default new AddToOnlineListMiddleware();