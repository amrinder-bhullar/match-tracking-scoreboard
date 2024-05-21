import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  if (req.method === "GET") {
    try {
      const team = await db
        .collection("playing_teams")
        .findOne({ _id: new ObjectId(req.query.id) });
      res.status(200).json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to load team" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
