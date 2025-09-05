import authRouter from "./modules/Auth/auth.controller.js"
import userRouter from "./modules/User/user.controller.js"
import messageRouter from "./modules/Message/message.controller.js"
import connectDB from "./DB/connection.js";
import { globelErorrHandling } from "./utils/erorrHandling.utils.js";
import cors from "cors";
import path from "node:path";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";



const bootstrap = async (app, express) => {

    const limiter = rateLimit({
        windowMs: 60 * 1000, // 15 minutes
        limit: 3,
        message: {
            statusCode: 429,
            message: "Too many accounts created from this IP, please try again ",
        },
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(limiter);



    await connectDB();

    app.use("/", (req, res, next) => {
        return res.status(200).json({ message: "welcome to sara7a app" })
    });

    app.use("/uploads", express.static(path.resolve("./src/uploads")))
    app.use("/api/auth", authRouter);
    app.use("/api/user", userRouter);
    app.use("/api/message", messageRouter);

    app.all("/*dummy", (req, res, next) => {
        return next(new Error("not found handler!!!!!!!!!!!!", { cause: 404 }))
    })









    app.use(globelErorrHandling)








}
export default bootstrap;