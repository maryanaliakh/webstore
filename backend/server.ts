
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import authConfig from "./clients/auth";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authConfig);
app.use(routes());

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
