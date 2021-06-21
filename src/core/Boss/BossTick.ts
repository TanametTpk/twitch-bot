import Tickable from "../interfaces/Tickable";
import Boss from "./Boss";

export default class BossTick extends Boss implements Tickable {
    protected bossAge: number

    constructor (name: string, hp: number, level: number, bossAge: number) {
        super(name, hp, level)
        this.bossAge = bossAge
    }

    public start(): void {}
    
    public update(): void {
        this.bossAge -= 1;
        if (this.bossAge < 1) this.bossAge = 0
    }

    public isBossTimeout(): boolean {
        return this.bossAge < 1;
    }

    public getBossRemainTime(): number {
        return this.bossAge
    }
}