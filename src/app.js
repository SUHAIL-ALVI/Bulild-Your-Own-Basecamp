import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

//Basic Configurations
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies
app.use(express.static("public")) // to serve static files such as images, CSS files, and JavaScript files
app.use(cookieParser());

//app configurations
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))


//import the routes

import healthcheckRoutes from "./routes/healthcheck.routes.js"
import authRouter from "./routes/auth.routes.js"


app.use("/api/v1/healthcheck", healthcheckRoutes)
app.use("/api/v1/auth", authRouter)

app.get("/", (req, res) => {
    res.send("This is basecamp home page")
})


export default app;