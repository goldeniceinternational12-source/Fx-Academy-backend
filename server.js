const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
const helmet = require("helmet");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);

/**
 * ===============================
 * SOCKET.IO
 * ===============================
 */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`🟢 User Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔴 User Disconnected: ${socket.id}`);
  });
});

/**
 * ===============================
 * MIDDLEWARE
 * ===============================
 */
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use("/uploads", express.static("uploads"));

/**
 * ===============================
 * ROUTES
 * ===============================
 */

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const materialRoutes = require("./routes/materialRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/material-requests", materialRoutes);
app.use("/api/admin", adminRoutes);

/**
 * ===============================
 * HOME ROUTE
 * ===============================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MILMICH FX Academy API is running.",
  });
});

/**
 * ===============================
 * 404 HANDLER
 * ===============================
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

/**
 * ===============================
 * GLOBAL ERROR HANDLER
 * ===============================
 */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/**
 * ===============================
 * DATABASE CONNECTION
 * ===============================
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed");
    console.error(err.message);
    process.exit(1);
  });