import { Server } from "socket.io";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("Setting up Socket.io server...");

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

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
  } else {
    console.log("Socket.io server already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
