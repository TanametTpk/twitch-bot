import "reflect-metadata";
import {createConnection} from "typeorm";
import dotenv from "dotenv";
import Bot from './bot';

dotenv.config();

const bot: Bot = new Bot();

createConnection().then(async connection => {
    console.log("Inserting a new user into the database...");
    bot.start();
}).catch(error => {
    console.log(error)
    bot.stop();
});
