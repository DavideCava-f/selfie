import express from "express";
import dotenv from "dotenv";
import verifyToken from "./middleware.js";
const router = express.Router();

dotenv.config();
const uri = process.env.MONGODB_DEV;

router.put("/", verifyToken, async function(req, res) {
  try {
    if (req.body.setNoted) {
      await Event.updateOne({ _id: req.body.id_Event, "notification.advance._id": req.body.id_Advance }, {
        $set:
        {
          'notification.advance.$[].noted': true
        }
      });
    }
  } catch (error) {
    res.status(500).send();
  } finally {
  }
});

export default router;
