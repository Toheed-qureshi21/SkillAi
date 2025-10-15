import mongoose from "mongoose";
export const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI!,{
            dbName: "SkillAi",
        });
        console.log("Database connected successfully ✅");
    } catch (error) {
        console.log("Error while connecting to database ❌", error);
        process.exit(1);
    }
}