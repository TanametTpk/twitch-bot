import dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import {createConnection} from "typeorm";
import Bot from './bot';
import './game/index';

const bot: Bot = new Bot();

createConnection().then(async connection => {
    console.log("Bot is Running!");
    bot.start();
}).catch(error => {
    console.log(error)
    bot.stop();
});
