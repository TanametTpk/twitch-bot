import PVPSystem from "./PVPSystem";

export default class AutoTogglePVPSystem extends PVPSystem {
    private pvpTime: number
    private preNotifyTime: number
    private currentPvpTime: number

    constructor(pvpTime: number, preNotifyTime: number) {
        super()
        this.isOn = true
        this.pvpTime = pvpTime
        this.preNotifyTime = pvpTime - preNotifyTime > 0 ? preNotifyTime : -1
        this.currentPvpTime = 0
    }

    update(): void {
        this.currentPvpTime -= 1
        if (this.currentPvpTime === this.preNotifyTime) {
            this.preNotify()
        }

        if (this.currentPvpTime < 1) {
            this.currentPvpTime = this.pvpTime
            this.toggleOnOff()
            this.statusNotify()
        }
    }

    public getRemainTime(): number {
        return this.currentPvpTime
    }

    public preNotify(): void {
        let status: string = this.isOn ? "ปิด" : "เปิด"
        this.notify(`อีก ${this.getRemainTime()} วิ pvp จะ${status}แล้ว`)
    }
}