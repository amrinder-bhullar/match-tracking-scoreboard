import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  if (req.method === "POST") {
    try {
      const { teamId, playerId, playerType, show } = req.body;
      const updateField = `${playerType}.$[elem].show`;
      const result = await db
        .collection("playing_teams")
        .updateOne(
          { _id: new ObjectId(teamId) },
          { $set: { [updateField]: show } },
          { arrayFilters: [{ "elem._id": new ObjectId(playerId) }] }
        );

      const updatedTeam = await db
        .collection("playing_teams")
        .findOne({ _id: new ObjectId(teamId) });
      if (global.io) {
        global.io.emit("update", updatedTeam);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to update player show status" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
