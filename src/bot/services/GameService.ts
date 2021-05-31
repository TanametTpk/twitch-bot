import GameManager from "../../game";
import Boss from "../../game/Boss";
import ICharacterService from "../../interfaces/services/ICharacterService";
import IEquipmentService from "../../interfaces/services/IEquipmentService";
import IGameService from "../../interfaces/services/IGameService";
import services from "../services";

class GameService implements IGameService {
    private characterService: ICharacterService
    private game: GameManager

    constructor(characterService: ICharacterService, equipmentService: IEquipmentService) {
        this.characterService = characterService
        this.game = new GameManager(characterService, equipmentService)
    }

    public async attackBossBy(playerId: string): Promise<void> {
        let chracter = await this.characterService.getCharacterByUserHash(playerId);
        if (!chracter) return;
        
        this.game.attackBoss(chracter.id)
    }

    public async pvp(attackerId: string, attackedId: string): Promise<void> {
        throw new Error("not implement yet");
    }

    public getBoss(): Boss | undefined {
        return this.game.bossManager.getBoss();
    }

    public getBossAttackTime(): Date | undefined {
        return this.game.getBossNextAttack();
    }

    public spawnBoss(): void {
        this.game.spawnBoss();
    }

    public getGameManager(): GameManager {
        return this.game;
    }

    public isPlayerOnline(hash: string) {
        return this.game.playerManager.isPlayerOnline(hash);
    }

    public giveRewardToAllPlayer(coin: number): void {
        services.character.addCoinToAllCharacter(coin);
    }

    public async giveRewardToPlayer(hash: string, coin: number): Promise<void> {
        let character = await services.character.getCharacterByUserHash(hash);
        if (!character) return;

        services.character.addCoinToCharacter(character.id, coin);
    }
}

export default GameService;