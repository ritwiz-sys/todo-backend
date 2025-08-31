const express = require("express");


require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auths");
const todosRoutes = require("./routes/todos");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Route mounting
app.use("/auth", authRoutes);
app.use("/todos", todosRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
