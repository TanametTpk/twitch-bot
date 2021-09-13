import dotenv from "dotenv";
dotenv.config({path:".env.dev"});

import "reflect-metadata";
import prisma from './database/client';
import Bot from './bot';
import "./bot/services";
import * as WebServer from './webserver/server';

let bot: Bot | undefined

async function main() {
    WebServer.start();

    bot = new Bot();
    bot.start();
    console.log("Bot is Running!");
}

main()
    .catch(async e => {
        if (process.env.DEBUG === "true")
            console.log(e);

        if (bot)
            bot.stop();

        await prisma.$disconnect()
        WebServer.stop();
    })