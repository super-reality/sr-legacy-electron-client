require("dotenv").config();

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

let sockets = [];
let users = [];

io.on("connection", socket => {
    sockets.push(socket);

    socket.emit("initializeUsers", users);

    users.push(socket.id);
    sockets.forEach(s => s.emit("userConnected", socket.id));

    console.log(`user connected: ${socket.id}`);

    socket.on("disconnect", () => {
        users = users.filter(user => user !== socket.id);
        sockets = sockets.filter(s => s !== socket);
        sockets.forEach(s => s.emit("userDisconnected", socket.id));
        console.log(`user disconnected: ${socket.id}`);
    });

});

server.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));
