var express = require("express");
var app = express();

app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var users = [];
var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(process.env.PORT || 3000);
console.log("server is running");

io.on("connection", function (socket) {
  console.log("Connected with: " + socket.id);

  socket.on("disconnect", function () {
    console.log(socket.id + " disconnected");
    users.splice(users.indexOf(socket.userName), 1);
    socket.broadcast.emit("sbd-logout", users);
  });

  socket.on("username-send", function (data) {
    if (users.indexOf(data) >= 0) {
      socket.emit("username-taken");
    } else {
      users.push(data);
      socket.userName = data;
      console.log("user " + data + " has joined");
      socket.emit("success-login", data);
      io.sockets.emit("user-online-list", users);
    }
  });

  socket.on("logout", function () {
    users.splice(users.indexOf(socket.userName), 1);
    console.log(socket.userName + " logged out");
    socket.broadcast.emit("sbd-logout", users);
  });

  socket.on("user-send-mess", function (data) {
    io.sockets.emit("server-send-mess", { usn: socket.userName, mess: data });
  });
});

app.get("/", function (req, res) {
  res.render("homepage");
});
