import dotenv from "dotenv";
dotenv.config({path:".env.dev"});

import "reflect-metadata";
import {createConnection} from "typeorm";
import Bot from './bot';

let bot: Bot | undefined

createConnection().then(async connection => {
    bot = new Bot();
    require('./game/index');
    bot.start();
    console.log("Bot is Running!");
}).catch(error => {
    console.log(error)
    if (bot)
        bot.stop();
});
