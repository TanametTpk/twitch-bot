import tmi, { Client } from "tmi.js";

export default interface ITwitchMysteryGift {
    perform(client: Client, channel: string, username: string, numbOfSubs: number, methods: tmi.SubMethods, userstate: tmi.SubMysteryGiftUserstate): void
}