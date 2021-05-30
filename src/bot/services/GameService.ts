import game from "../../game";
import Boss from "../../game/Boss";
import ICharacterService from "../../interfaces/services/ICharacterService";
import IGameService from "../../interfaces/services/IGameService";

class GameService implements IGameService {
    private characterService: ICharacterService

    constructor(characterService: ICharacterService) {
        this.characterService = characterService
    }

    async attackBossBy(playerId: string): Promise<void> {
        let chracter = await this.characterService.getCharacterByUserHash(playerId);
        if (!chracter) return;
        
        game.attackBoss(chracter.id)
    }

    async pvp(attackerId: string, attackedId: string): Promise<void> {
        throw new Error("not implement yet");
    }

    getBoss(): Boss | undefined {
        return game.bossManager.getBoss();
    }

    getBossAttackTime(): Date | undefined {
        return game.getBossNextAttack();
    }

    spawnBoss(): void {
        game.spawnBoss();
    }
}

export default GameService;