import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  if (req.method === "POST") {
    try {
      const { _id, name, raids, stops, out, doubleTouch } = req.body;
      const totalPoints = raids + stops + out + doubleTouch;
      const result = await db
        .collection("teams")
        .findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $set: { name, raids, stops, out, doubleTouch, totalPoints } },
          { returnDocument: "after", upsert: true }
        );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to update team" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
