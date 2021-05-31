import dotenv from "dotenv";
dotenv.config({path:".env.dev"});

import "reflect-metadata";
import prisma from './database/client';
import Bot from './bot';
import "./bot/services";

let bot: Bot | undefined

async function main() {
    bot = new Bot();
    bot.start();
    console.log("Bot is Running!");
}

main()
    .catch(async e => {
        console.log(e);
        if (bot)
            bot.stop();

        await prisma.$disconnect()
        throw e
    })