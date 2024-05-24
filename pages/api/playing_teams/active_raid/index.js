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

        let activeRaider = null;
        let activeStopper = null;

        if (activeRaid) {
          activeRaider = activeRaid.raiders.find(
            (raider) => raider.show === true
          );
        }

        const activeStop = await db
          .collection("playing_teams")
          .findOne({ stoppers: { $elemMatch: { show: true } } });

        if (activeStop) {
          activeStopper = activeStop.stoppers.find(
            (stopper) => stopper.show === true
          );
        }

        res.status(200).json({
          raider: activeRaider
            ? {
                teamId: activeRaid._id,
                playerId: activeRaider._id,
                playerType: "raiders",
                playerName: activeRaider.name,
                teamName: activeRaid.name,
              }
            : null,
          stopper: activeStopper
            ? {
                teamId: activeStop._id,
                playerId: activeStopper._id,
                playerType: "stoppers",
                playerName: activeStopper.name,
                teamName: activeStop.name,
              }
            : null,
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to load playing teams" });
      }
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
