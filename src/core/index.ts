import BossManager from "./BossManager";
import PlayerManager from "./PlayerManager";
import ICharacterService from "../interfaces/services/ICharacterService";
import IEquipmentService from "../interfaces/services/IEquipmentService";
import TickSystem from "./TickSystem";
import TwitchBossSpawnNotifyEvent from "./Boss/events/spawn/TwitchNotifyEvent";
import TwitchBossDeadNotifyEvent from "./Boss/events/dead/TwitchNotifyEvent";
import GiveRewardToAllPlayerEvent from "./Boss/events/dead/GiveRewardToAllPlayerEvent";
import WebSocketBossDeadNotifyEvent from "./Boss/events/dead/WebSocketNotifyEvent";
import DiscordBossSpawnNotifyEvent from "./Boss/events/spawn/DiscordNotifyEvent";
import WebSocketBossSpawnNotifyEvent from "./Boss/events/spawn/WebSocketNotifyEvent";

class GameCore {
    private static instance: GameCore;
    public tickSystem: TickSystem;
    public bossManager: BossManager;
    public playerManager: PlayerManager;

    private constructor() {
        this.tickSystem = new TickSystem();
        this.bossManager = BossManager.getInstance();
        this.playerManager = PlayerManager.getInstance();

        this.config();

        this.tickSystem.register(this.bossManager);
        this.tickSystem.register(this.playerManager);
        this.tickSystem.start();
    }

    public static getInstance(): GameCore {
        if (!GameCore.instance) {
            GameCore.instance = new GameCore();
        }

        return GameCore.instance;
    }

    // constructor(characterService: ICharacterService, equipmentService: IEquipmentService) {
    //     this.tickSystem = new TickSystem();
    //     this.bossManager = new BossManager();
    //     this.playerManager = new PlayerManager(characterService, equipmentService);

    //     this.config(characterService);

    //     this.tickSystem.register(this.bossManager);
    //     this.tickSystem.register(this.playerManager);
    //     this.tickSystem.start();
    // }

    private config(): void {
        this.bossManager.addSpawnEvent(new TwitchBossSpawnNotifyEvent())
        this.bossManager.addSpawnEvent(new DiscordBossSpawnNotifyEvent())
        this.bossManager.addSpawnEvent(new WebSocketBossSpawnNotifyEvent())

        this.bossManager.addDeadEvent(new TwitchBossDeadNotifyEvent())
        this.bossManager.addDeadEvent(new GiveRewardToAllPlayerEvent())
        this.bossManager.addDeadEvent(new WebSocketBossDeadNotifyEvent())
    }
}

export default GameCore;