require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./modules/auth/auth.routes");
const creatorProfileRoutes = require("./modules/creator-profile/creatorProfile.routes");
const goalRoutes = require("./modules/goals/goal.routes");
const postRoutes = require("./modules/posts/post.routes");
const donationRoutes = require("./modules/donations/donation.routes");
const commentRoutes = require("./modules/comments/comment.routes");
const favoriteRoutes = require("./modules/favorites/favorite.routes");
const creatorRoutes = require("./modules/creators/creator.routes");
const feedRoutes = require("./modules/feed/feed.routes");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/creator-profile", creatorProfileRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/creators", creatorRoutes);
app.use("/api/feed", feedRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

module.exports = app;
