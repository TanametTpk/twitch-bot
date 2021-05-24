import { IsNull, Not } from "typeorm";
import { Character } from "../../database/entity/Character";
import { CharacterEquipment } from "../../database/entity/CharacterEquipment";
import { User } from "../../database/entity/User";
import ICharacterService from "../../interfaces/ICharacterService";

class CharacterService implements ICharacterService {
    public createCharacter(user: User): Promise<Character | undefined> {
        const character = new Character();

        character.user = user;
        character.coin = 0;
        character.hp = 100;
        character.max_hp = 100;
        character.atk = 10;

        return character.save();
    }

    public getCharacterById(id: number): Promise<Character | undefined> {
        return Character.findOne(id);
    }

    public async healCharacter(id: number, heal_power: number): Promise<Character | undefined> {
        const character = await this.getCharacterById(id);
        if (!character || heal_power < 1) return character;

        character.hp += heal_power;
        if (character.hp > character.max_hp)
            character.hp = character.max_hp;

        return character.save();
    }

    public async attackCharacter(id: number, atk_power: number): Promise<Character | undefined> {
        const character = await this.getCharacterById(id);
        if (!character || atk_power < 1) return character;

        character.hp -= atk_power;
        if (character.hp < 0)
            character.hp = 0;

        return character.save();
    }

    public async addCoinToCharacter(id: number, coin: number): Promise<Character | undefined> {
        const character = await this.getCharacterById(id);
        if (!character || coin < 1) return character;

        character.coin += coin;
        return character.save();
    }

    public async removeCoinFromCharacter(id: number, coin: number): Promise<Character | undefined> {
        const character = await this.getCharacterById(id);
        if (!character || coin < 1) return character;

        character.coin -= coin;
        return character.save();
    }

    public async updateCharacterStatus(id: number, max_hp: number, atk: number): Promise<Character | undefined> {
        const character = await this.getCharacterById(id);
        if (!character) return;

        character.max_hp = max_hp;
        character.atk = atk;
        return character.save();
    }

    public async setEquipment(id: number, equipment: CharacterEquipment): Promise<Character | undefined> {
        const character = await this.getCharacterById(id);
        if (!character) return;

        character.equipment = equipment;
        return character.save();
    }

    public async removeEquipment(id: number): Promise<Character | undefined> {
        const character = await this.getCharacterById(id);
        if (!character) return;

        character.equipment?.remove();
        character.equipment = null;
        return character.save();
    }

    public getAllArmedPlayer(): Promise<[Character[], number]> {
        return Character.findAndCount({
            where: {
                equipment: Not(IsNull())
            }
        });
    }
}

export default new CharacterService();