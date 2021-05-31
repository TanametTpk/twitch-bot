import CharacterService from "./services/CharacterService";
import EquipmentService from "./services/EquipmentService";
import GameService from "./services/GameService";
import ShopService from "./services/ShopService";
import UserService from "./services/UserService";
import client from '../database/client';

const character = new CharacterService(client)
const equipment = new EquipmentService(client)
const user = new UserService(client)
const game = new GameService(character, equipment)
const shop = new ShopService(character, game)

export default {
    character,
    equipment,
    user,
    game,
    shop,
}