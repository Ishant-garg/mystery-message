import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";



export  async function POST(request: Request) {
    dbConnect();
    const {messageId} = await request.json();

    const session = await getServerSession(AuthOptions);
    
    if (!session) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
        
    const user = session.user;
    if(!user){
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try{
        const response = await UserModel.updateOne(
            { _id : new mongoose.Types.ObjectId(user._id)},
            { $pull: { messages: { _id: messageId } } },
           
        )
        if(response.modifiedCount === 0){
            return Response.json({ success: false, message: "Message not found or already deleted" }, { status: 404 });
        }

        return  Response.json({ success: true, message: "Message deleted successfully" }, { status: 200 });
    }
    catch(error){
        return Response.json({ success: false, message: "Error in deleting message" }, { status: 500 });
    }

}