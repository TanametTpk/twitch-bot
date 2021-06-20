import { Character } from "@prisma/client";
import ICharacterService, { IncludeUserAndEquipment } from "../../interfaces/services/ICharacterService";
import IGameService from "../../interfaces/services/IGameService";
import IShopService from "../../interfaces/services/IShopService";
import PlayerDeadError from "../errors/PlayerDeadError";

class ShopService implements IShopService {
    private characterService: ICharacterService
    private gameService: IGameService

    constructor(characterService: ICharacterService, gameService: IGameService) {
        this.characterService = characterService;
        this.gameService = gameService;
    }

    async buyEquipment(hash: string, coin: number): Promise<Character & IncludeUserAndEquipment | null> {
        let playerManager = this.gameService.getGameManager().playerManager
        let player = playerManager.getPlayer(hash)
        if (!player) return null;
        
        if (player.isDead()) {
            throw new PlayerDeadError("can't buy because player is dead")
        }

        player = await this.gameService.getGameManager().shop.buyEquipment(player, coin);
        if (!player) return null;
        
        playerManager.removeOnlinePlayer(player)
        playerManager.addOnlinePlayer(player)
        return this.characterService.getCharacterByUserHash(hash);
    }
}

export default ShopService;