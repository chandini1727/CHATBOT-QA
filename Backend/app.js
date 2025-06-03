const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/fileRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api/files", fileRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});
