import game from "../../game";
import Boss from "../../game/Boss";
import IGameService from "../../interfaces/services/IGameService";
import CharacterService from "./CharacterService";

class GameService implements IGameService {
    async attackBossBy(playerId: string): Promise<void> {
        let chracter = await CharacterService.getCharacterByUserHash(playerId);
        if (!chracter) return;
        
        game.attackBoss(chracter.id)
    }

    async pvp(attackerId: string, attackedId: string): Promise<void> {
        let attacker = await CharacterService.getCharacterByUserHash(attackerId);
        if (!attacker) return;

        await CharacterService.attackCharacter(attacker.id, attacker.atk + (attacker.equipment?.atk || 0))
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

export default new GameService();