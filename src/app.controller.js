import authRouter from "./modules/Auth/auth.controller.js"
import userRouter from "./modules/User/user.controller.js"
import messageRouter from "./modules/Message/message.controller.js"
import connectDB from "./DB/connection.js";
import { globelErorrHandling } from "./utils/erorrHandling.utils.js";
import cors from "cors";
import path from "node:path";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { corsOptions } from "./utils/cors/cors.js";



const bootstrap = async (app, express) => {

    const limiter = rateLimit({
        windowMs:15* 60 * 1000, // 15 minutes
        limit: 100,
        message: {
            statusCode: 429,
            message: "Too many accounts created from this IP, please try again ",
        },
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    app.use(express.json());
    app.use(cors(corsOptions()));
    app.use(helmet());
    app.use(limiter);



    await connectDB();


    app.get("/",(req,res)=>{
        return res.status(200).json({message:"Welcome To Sara7a App"})
    })
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