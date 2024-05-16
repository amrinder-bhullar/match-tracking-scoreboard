const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const socketIo = require("socket.io");
const clientPromise = require("./lib/mongodb");
const { ObjectId } = require("mongodb");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  });

  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("updateScore", async (data) => {
      const client = await clientPromise;
      const db = client.db();
      await db
        .collection("teams")
        .updateOne(
          { _id: new ObjectId(data._id) },
          {
            $set: {
              name: data.name,
              raids: data.raids,
              stops: data.stops,
              totalPoints: data.totalPoints,
            },
          },
          { upsert: true }
        );
      io.emit("scoreUpdated", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  const port = parseInt(process.env.PORT, 10) || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
