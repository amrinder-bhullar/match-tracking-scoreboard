import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  if (req.method === "POST") {
    try {
      await db
        .collection("teams")
        .updateMany(
          {},
          {
            $set: {
              raids: 0,
              stops: 0,
              out: 0,
              doubleTouch: 0,
              totalPoints: 0,
            },
          }
        );
      const teams = await db.collection("teams").find({}).toArray();
      res.status(200).json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to reset teams" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
