
export default class PVPModeOffError extends Error {
    constructor(msg: string) {
        super(`PVP Mode is off: ${msg}`)
    }
}