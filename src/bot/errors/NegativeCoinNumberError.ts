
export default class NegativeCoinNumberError extends Error {
    constructor(msg: string) {
        super(`Negative Coin Number Error: ${msg}`)
    }
}