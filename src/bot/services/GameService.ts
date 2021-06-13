import { User } from "@prisma/client";
import GameManager from "../../game";
import Boss from "../../game/Boss";
import ICharacterService from "../../interfaces/services/ICharacterService";
import IEquipmentService from "../../interfaces/services/IEquipmentService";
import IGameService from "../../interfaces/services/IGameService";
import services from "../services";
import roll from "../utils/roll";

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

    public async pvp(attackerId: string, attackedId: string): Promise<User | null> {
        let attacker = await this.characterService.getCharacterByUserHash(attackerId)
        let attacked = await this.characterService.getCharacterByUserHash(attackedId)

        if (!attacker || !attacked) return null

        let attackerDmg = this.game.playerManager.calculateAttackPowerOf(attacker)
        let attackedDmg = this.game.playerManager.calculateAttackPowerOf(attacked)
        let attackDiffRatio = attackedDmg / attackerDmg
        if (attackDiffRatio < 1) return attacked.user

        let successRate = 100 / attackDiffRatio
        if (roll(successRate)) return attacked.user
        return attacker.user
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

    public canPVP(): boolean {
        return this.game.getCanPvp();
    }

    public setPVPModeOn(): void {
        if (this.game.getCanPvp()) return;
        this.game.toggleEnableDisablePvp()
    }

    public setPVPModeOff(): void {
        if (!this.game.getCanPvp()) return;
        this.game.toggleEnableDisablePvp();
    }
}

export default GameService;