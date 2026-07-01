const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors({
   origin: "*",
methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use("/uploads", express.static("uploads"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ===============================
// ROUTES
// ===============================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const materialRoutes = require("./routes/materialRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {
    res.send("API is running...");
});

// ===============================
// CREATE HTTP SERVER (IMPORTANT)
// ===============================
const server = http.createServer(app);

// ===============================
// SOCKET.IO SETUP (REALTIME CORE)
// ===============================
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// make io available everywhere (controllers)
app.set("io", io);

// listen for connections
io.on("connection", (socket) => {
    console.log("🟢 Admin connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("🔴 Admin disconnected:", socket.id);
    });
});

// ===============================
// DATABASE CONNECTION + SERVER START
// ===============================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        const PORT = process.env.PORT || 5000;

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err.message);
    });