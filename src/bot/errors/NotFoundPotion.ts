
export default class NotFoundPotion extends Error {
    constructor(msg: string) {
        super(`NotFoundPotion: ${msg}`)
    }
}