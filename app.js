const express = require("express");
const app = express();
const http =require("http").Server(app); // from express package
const io = require("socket.io")(http);  //bounds to http server

const port = process.env.PORT || 8080;


app.use("/", express.static(__dirname + "/public") );



const onConnection = socket => {
socket.on("drawing", data =>socket.broadcast.emit("drawing",data));
};

io.on("connection", onConnection )

http.listen(port, () => {
 console.log("Listening for connection at  " + port + "  server started.");

}  );