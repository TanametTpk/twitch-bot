import GameManager from "../../game";
import Boss from "../../game/Boss";
import ICharacterService from "../../interfaces/services/ICharacterService";
import IEquipmentService from "../../interfaces/services/IEquipmentService";
import IGameService from "../../interfaces/services/IGameService";

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
}

export default GameService;