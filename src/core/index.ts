import BossManager from "./BossManager";
import PlayerManager from "./PlayerManager";
import TickSystem from "./TickSystem";
import TwitchBossSpawnNotifyEvent from "./Boss/events/spawn/TwitchNotifyEvent";
import TwitchBossDeadNotifyEvent from "./Boss/events/dead/TwitchNotifyEvent";
import GiveRewardToAllPlayerEvent from "./Boss/events/dead/GiveRewardToAllPlayerEvent";
import WebSocketBossDeadNotifyEvent from "./Boss/events/dead/WebSocketNotifyEvent";
import DiscordBossSpawnNotifyEvent from "./Boss/events/spawn/DiscordNotifyEvent";
import WebSocketBossSpawnNotifyEvent from "./Boss/events/spawn/WebSocketNotifyEvent";
import Shop from "./Shop";
import SpellManager from "./SpellManager";
import ExplosionSpell from "./Spell/ExplosionSpell";
import DamageBuffSpell from "./Spell/DamageBuffSpell";
import BankaiSpell from "./Spell/BankaiSpell";

class GameCore {
    private static instance: GameCore;
    public tickSystem: TickSystem;
    public bossManager: BossManager;
    public playerManager: PlayerManager;
    public shop: Shop;
    public spellManager: SpellManager;

    private constructor() {
        this.tickSystem = new TickSystem();
        this.shop = new Shop()
        this.spellManager = new SpellManager();
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

    private config(): void {
        this.configBoss()
        this.configSpell()
    }

    private configBoss(): void {
        this.bossManager.addSpawnEvent(new TwitchBossSpawnNotifyEvent())
        this.bossManager.addSpawnEvent(new DiscordBossSpawnNotifyEvent())
        this.bossManager.addSpawnEvent(new WebSocketBossSpawnNotifyEvent())

        this.bossManager.addDeadEvent(new TwitchBossDeadNotifyEvent())
        this.bossManager.addDeadEvent(new GiveRewardToAllPlayerEvent())
        this.bossManager.addDeadEvent(new WebSocketBossDeadNotifyEvent())
    }

    private configSpell(): void {
        this.spellManager.addSpell(new ExplosionSpell(30))
        this.spellManager.addSpell(new DamageBuffSpell(1))
        this.spellManager.addSpell(new BankaiSpell(1))
    }
}

export default GameCore;