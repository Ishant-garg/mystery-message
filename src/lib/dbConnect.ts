import mongoose from "mongoose";

type connectionObject = {
    isConnected ?: number
}

const connection : connectionObject = {}


async function dbConnect() : Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected");
        return;
    }

    try{
        const db =  await mongoose.connect( process.env.MONGO_URI || "", {    
        })
        connection.isConnected = db.connections[0].readyState
        console.log("Connected to MongoDB");
    }
    catch(error) {
        console.log(error);
        process.exit(1);
    }
}

export default dbConnect