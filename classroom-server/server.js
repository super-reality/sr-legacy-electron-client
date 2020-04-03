require("dotenv").config();

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { makeData, makeSession } = require("./mock");

app.use(express.json());

let data = makeData();

app.post("/auth", (request, response) => {
    let credentials = request.body;
    let user = data.users.find(u => u.username === credentials.username && u.password === credentials.password);
    if(user) {
        if(data.sessions.find(s => s.userId === user.id)) {
            data.sessions = data.sessions.filter(s => s.userId !== user.id);
        }
        let session = makeSession(user);
        data.sessions.push(session);
        response.send({success: true, payload: {token: session.token}});
    }
    else {
        response.send({success: false, error: {message: "Invalid username or password."}});
    }
});

app.get("/classes", (request, response) => {
    let { token } = request.query;
    let session = data.sessions.find(s => s.token === token);
    if(session) {
        let classes = data.userClasses.filter(userClass => userClass.userId === session.userId).map(userClass => data.classes.find(c => c.id === userClass.classId));
        response.send({success: true, payload: classes});
    }
    else {
        response.send({success: false, error: {message: "Invalid authentication token."}});
    }
});

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
