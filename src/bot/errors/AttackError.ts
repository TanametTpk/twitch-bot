
export default class AttackError extends Error {
    constructor(msg: string) {
        super(`Attack Error: ${msg}`)
    }
}