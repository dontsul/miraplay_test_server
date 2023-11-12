import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";

export const app = express();
dotenv.config();

//constants
const PORT = process.env.PORT || 4001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Middleware
app.use(cors());
app.use(express.json());

// Router
// http://localhost:3002/
app.use("/api/auth", authRoute);

//start server
async function startServer() {
  try {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.emxtoj0.mongodb.net/${DB_NAME}?retryWrites=true&w=majority
`);

    app.listen(PORT, () => {
      console.log(`Server start on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
startServer();
