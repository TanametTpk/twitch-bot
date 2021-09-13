import { Client, ChatUserstate } from "tmi.js";
import ICommand from "../../../interfaces/ICommand";
import ITwitchCommand from "../../../interfaces/ITwitchCommand";
import randomIntBetween from "../../utils/randomIntBetween";

class LuckCheckCommand implements ICommand, ITwitchCommand {
    private messages: string[] = [
        "ดวงแย่สุดเลยนะเนี่ย",
        "ดวงกุดจัดๆ",
        "ไร้ดวงจริงๆ คนๆนี้",
        "ดวงเหมือนจะดี แต่ก็ไม่ดี",
        "ดวง 404",
        "ดวง undefined วะ",
        "ซวยชัดๆ",
        "<- ตัวซวยเห็นๆ",
        "ไปทำบุญบ้างนะเราอะ",
        "นายน่ะ เป็นผู้ใช้ stand ยังไงหรอ!! ไม่ใช่หรอ?? แล้วคนที่อยู่ข้างหลังนั้นใครอ่ะ!!!!!",
        "ดวงดาว แบบนี้เรียกว่า มูนนนนนน ซู๊ดดดดด",
        "ดวงที่อยู่ folder เดี๋ยวกัน จะมีดวงต่างกัน (ดวงปานกลาง)",
        "ดวงจันทร์ ได้ไหมนะ? (ดวงปานกลาง)",
        "ดวง ที่เป็นแมลงอะ (ดวงปานกลาง)",
        "ดวง ที่อยู่บนหน้าช้าง (ดวงปานกลาง)",
        "ดวงน่าจะใช้ได้อยู่บ้าง",
        "ดวงใช้ พอได้",
        "ดวงพอใช้ได้",
        "ดวง[เสียงเบา] (ดวงไม่ค่อยแรง)",
        "ดวง!!!!! (ดวงมาแรงมาก)",
        "ดวงดี แหล่ะมั้ง!",
        "ดวงดี ใช่ๆ ก็ดีแหล่ะ",
        "ดวงดีค่ดๆ แบบนี้มันอะไรกัน!!!",
        "NANIIII!!! ดวงเทพเจ้าชัดๆ"
    ]

    match(text: string): boolean {
        return text === "!เช็คดวงแบบเสริม";
    }

    async perform(client: Client, channel: string, tags: ChatUserstate, message: string): Promise<void> {
        client.say(channel, `@${tags.username} ${this.messages[randomIntBetween(0, this.messages.length - 1)]}`)
    }
}

export default new LuckCheckCommand();