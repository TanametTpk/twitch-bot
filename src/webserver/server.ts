import express from 'express'
import http from 'http'
import path from 'path'
import socketIO from 'socket.io'
// import randomIntBetween from '../bot/utils/randomIntBetween';
// import Boss from '../game/Boss';
// import WebSocketApi from './socket/api';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

export const io = new socketIO.Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(express.static(path.join(__dirname, '/public/build')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/build', 'index.html'))
})

export const start = () => {
    server.listen(port, () => console.log(`web server listening on port ${port}!`));
    // setInterval(test, 5000)
}

export const stop = () => {
    server.close()
}

// const test = () => {
//     console.log("test running");
    
//     let boss = new Boss(100, randomIntBetween(1, 10))
//     boss.wasAttack(randomIntBetween(10, 90))
//     const api = WebSocketApi.getInstance()
//     api.showFeed("test", 'topLeft', 1.5)
//     api.updateBoss(boss)
// }