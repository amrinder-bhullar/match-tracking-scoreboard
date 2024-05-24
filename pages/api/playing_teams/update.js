import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  if (req.method === "POST") {
    try {
      const { teamId, playerId, playerType, show } = req.body;

      // First, update all players' show field to false for the given playerType
      await db
        .collection("playing_teams")
        .updateMany({}, { $set: { [`${playerType}.$[].show`]: false } });

      // If playerType is 'raiders', also set all stoppers to show: false after 30 seconds
      if (playerType === "raiders" && show) {
        // setTimeout(async () => {
        await db
          .collection("playing_teams")
          .updateMany({}, { $set: { [`stoppers.$[].show`]: false } });
        // }, 30000);
      }

      // Update the specific player's show field
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
