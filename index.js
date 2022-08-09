const app = require("express")()
const server = require("http").createServer(app);
const cors = require("cors");

const PORT = process.env.PORT || 3001
const io = require("socket.io")(server, {
  cors: {
    // origin: "https://video-chat--webrtc.vercel.app/",
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors())

// app.use((req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", "https://video-chat--webrtc.vercel.app");
// 	res.header("Access-Control-Allow-Credentials", "true");
// 	res.header(
// 		"Access-Control-Allow-Headers",
// 		"Origin, X-Requested-With, Content-Type, Accept"
// 	);
// 	res.header("Access-Control-Allow-Methods", "GET, POST");
// 	next();
// });

app.get("/demo", (req, res) => {
  res.send("demo")
})

io.on("connection", (socket) => {
  socket.emit("me", socket.id)

  socket.on("disconnect", () => {
    socket.broadcast.emit("callended")
  })

  socket.on("calluser", ({ userToCall, signalData, from, name}) => {
    io.to(userToCall).emit("calluser", ({signal: signalData, from, name}))
  })

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal)
  })

})

server.listen(PORT, () => console.log("Server listening on port " + PORT))