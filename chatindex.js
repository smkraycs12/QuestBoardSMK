import cors from 'cors';
import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const app = require("express")();
dotenv.config();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "https://questboardsmk.herokuapp.com",
      methods: ["GET", "POST"]
    }
  });
const whitelist = ['https://questboardsmk.herokuapp.com', 'http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors());
io.on("connect", (socket) => {
  console.log("user connected", socket.id);
  socket.on("chat-msg", function (data) {
    io.emit("chat-msg", data);
  });
});
app.all('*', function(req, res, next) {
  var origin = req.get('origin'); 
  res.header('Access-Control-Allow-Origin', origin);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
server.listen(process.env.SOCKET, function () {
  console.log(`listening on port: ` + process.env.SOCKET);
});