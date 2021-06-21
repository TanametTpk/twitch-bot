import Damagable from "./Damagable";

export default interface Attackable {
    attack(object: Damagable): void
}