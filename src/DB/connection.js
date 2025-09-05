import mongoose from "mongoose";

const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: process.env.PORT || 5000,
        });
        console.log("DB is conected .......");


    } catch (error) {

        console.log("DB is connection ERROR !!!!!!!!!!!!!", error.message);


    }

}


export default connectDB;