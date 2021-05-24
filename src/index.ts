import "reflect-metadata";
import {createConnection} from "typeorm";
import dotenv from "dotenv";
import Bot from './bot';
import './game/index';

dotenv.config();

const bot: Bot = new Bot();

createConnection().then(async connection => {
    console.log("Bot is Running!");
    bot.start();
}).catch(error => {
    console.log(error)
    bot.stop();
});
