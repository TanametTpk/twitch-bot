import game from "../../game";
import Boss from "../../game/Boss";
import IGameService from "../../interfaces/services/IGameService";
import CharacterService from "./CharacterService";

class GameService implements IGameService {
    async attackBossBy(playerId: number): Promise<void> {
        let chracter = await CharacterService.getCharacterByUserId(playerId);
        if (!chracter) return;
        
        game.attackBoss(chracter.id)
    }

    async pvp(attackerId: number, attackedId: number): Promise<void> {
        let attacker = await CharacterService.getCharacterByUserId(attackerId);
        if (!attacker) return;

        await CharacterService.attackCharacter(attackedId, attacker.atk + (attacker.equipment?.atk || 0))
    }

    getBoss(): Boss | undefined {
        return game.bossManager.getBoss();
    }

    getBossAttackTime(): Date | undefined {
        return game.getBossNextAttack();
    }
}

export default new GameService();