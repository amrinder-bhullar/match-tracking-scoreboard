// shows and hides raiders and stoppers
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  switch (req.method) {
    case "GET":
      try {
        const teams = await db.collection("playing_teams").find({}).toArray();
        res.status(200).json(teams);
      } catch (error) {
        res.status(500).json({ error: "Failed to load playing teams" });
      }
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
