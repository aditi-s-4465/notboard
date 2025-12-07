import express from "express";
import collectionRoutes from "./Collections.js";
import gameRoutes from "./Game.js";

export default function (app) {
  const router = express.Router();
  app.use("/api", router);

  router.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  router.use("/collections", collectionRoutes);
  router.use("/games", gameRoutes);
}
