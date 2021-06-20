import BossManager from "./BossManager";
import PlayerManager from "./PlayerManager";
import ICharacterService from "../interfaces/services/ICharacterService";
import IEquipmentService from "../interfaces/services/IEquipmentService";
import TickSystem from "./TickSystem";

class GameCore {
    public tickSystem: TickSystem;
    public bossManager: BossManager;
    public playerManager: PlayerManager;

    constructor(characterService: ICharacterService, equipmentService: IEquipmentService) {
        this.tickSystem = new TickSystem();
        this.bossManager = new BossManager();
        this.playerManager = new PlayerManager();

        this.tickSystem.register(this.bossManager);
        this.tickSystem.register(this.playerManager);
        this.tickSystem.start();
    }
}

export default GameCore;