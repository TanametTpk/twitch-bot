import dotenv from "dotenv";
dotenv.config({path:".env.dev"});

import "reflect-metadata";
import prisma from './database/client'
import Bot from './bot';

let bot: Bot | undefined

async function main() {
    bot = new Bot();
    require('./game/index');
    bot.start();
    console.log("Bot is Running!");
}

main()
    .catch(e => {
        throw e
    })
    .finally(async() => {
        if (bot)
            bot.stop();
        await prisma.$disconnect()
    })