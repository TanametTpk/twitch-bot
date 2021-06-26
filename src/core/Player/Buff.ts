import Tickable from "../interfaces/Tickable";

export default abstract class BuffBase implements Tickable {
    constructor(
        protected name: string,
        protected duration: number,
    ){}

    start(): void {}
    update(): void {
        this.duration -= 1
        if (this.duration < 1) this.duration = 0
    }

    public getName(): string {
        return this.name
    }

    public shouldDestroy(): boolean {
        return this.duration < 1;
    }

    public getBaseAttack(): number {
        return 0
    }

    public use(): void {}
}