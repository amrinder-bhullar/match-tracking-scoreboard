// shows and hides raiders and stoppers
import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  switch (req.method) {
    case "GET":
      try {
        const activeRaid = await db
          .collection("playing_teams")
          .findOne({ raiders: { $elemMatch: { show: true } } });

        if (activeRaid) {
          const activeRaider = activeRaid.raiders.find(
            (raider) => raider.show === true
          );
          res.status(200).json({
            teamId: activeRaid._id,
            playerId: activeRaider._id,
            playerType: "raiders",
            playerName: activeRaider.name,
            teamName: activeRaid.name,
          });
        } else {
          res.status(200).json(null);
        }
      } catch (error) {
        res.status(500).json({ error: "Failed to load playing teams" });
      }
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
