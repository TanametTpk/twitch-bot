import "reflect-metadata";
import {createConnection} from "typeorm";

createConnection().then(async connection => {
    console.log("Inserting a new user into the database...");

    // TODO - run bot here

}).catch(error => console.log(error));
