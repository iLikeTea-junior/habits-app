import express from "express";
import habitsRouter from "./routers/habits.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// over here we connect the routers
app.use("/api/habits", habitsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})