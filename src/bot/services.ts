import CharacterService from "./services/CharacterService";
import EquipmentService from "./services/EquipmentService";
import GameService from "./services/GameService";
import ShopService from "./services/ShopService";
import UserService from "./services/UserService";
import client from '../database/client';

export const character = new CharacterService(client)
export const equipment = new EquipmentService(client)
export const user = new UserService(client)
export const game = new GameService(character, equipment)
export const shop = new ShopService(character, game)

// export default {
//     character,
//     equipment,
//     user,
//     game,
//     shop,
// }