import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/connectDB.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Constants
const PORT = process.env.PORT;

// Routes
app.get("/", (req, res) => {
	res.send("API IS WORKING");
});

app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);

app.listen(PORT, () => {
	console.log("Server Started On Port", PORT);
});
