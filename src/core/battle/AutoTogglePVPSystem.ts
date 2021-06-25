import PVPSystem from "./PVPSystem";

export default class AutoTogglePVPSystem extends PVPSystem {
    private pvpTime: number
    private preNotifyTime: number
    private currentPvpTime: number
    private allowPvpTime: number

    constructor(pvpTime: number, allowPvpTime: number, preNotifyTime: number) {
        super()
        this.isOn = false
        this.pvpTime = pvpTime
        this.preNotifyTime = pvpTime - preNotifyTime > 0 ? preNotifyTime : -1
        this.currentPvpTime = pvpTime
        this.allowPvpTime = allowPvpTime
    }

    update(): void {
        this.currentPvpTime -= 1
        if (this.currentPvpTime === this.preNotifyTime) {
            this.preNotify()
        }

        if (this.currentPvpTime < 1) {
            if (!this.isOn) {
                this.currentPvpTime = this.allowPvpTime
            }else {
                this.currentPvpTime = this.pvpTime
            }
            this.toggleOnOff()
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