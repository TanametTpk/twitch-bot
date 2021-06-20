import Tickable from "../interfaces/Tickable";

export default abstract class BossTickAbstract implements Tickable {
    protected bossAge: number

    constructor (bossAge: number) {
        this.bossAge = bossAge
    }

    public start(): void {}
    
    public update(): void {
        this.bossAge -= 1;
    }

    public isBossTimeout(): boolean {
        return this.bossAge < 1;
    }
}