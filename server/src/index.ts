import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import apiRoutes from "./routes";
import { authMiddleware } from "./middlewares/auth-middleware";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/admin", authMiddleware, (req: Request, res: Response) => {
  res.send("Admin Dashboard");
});

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  // connect to mongodb
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("Mongo URI is missing");
    process.exit(1);
  } else {
    const connection = await mongoose.connect(mongoUri);

    if (connection) {
      console.log("Connected to MongoDB");
    } else {
      console.error("Failed to connect to MongoDB");
      process.exit(1);
    }
  }

  console.log(`Server is running on http://localhost:${PORT}`);
});
