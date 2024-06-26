import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";



export  async function GET(request: Request) {
    dbConnect();
    const session = await getServerSession(AuthOptions);
    
    if (!session) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
        
    const user = session.user;
    if(!user){
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId =new mongoose.Types.ObjectId(user._id);
    console.log('uudfsd ' , userId)
    
    try{
        const user = await UserModel.aggregate([
            {$match : { _id : userId}},
            {$unwind : "$messages"},
            {$sort : { "messages.createdAt" : -1}},
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ])
        if(!user ){
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }
        
        return  Response.json({
            success: true,
            message: "Messages fetched successfully",
            messages : user[0].messages  
        }, { status: 200 });
    }
    catch(err){
        console.log(err)
        return Response.json({ success: false, message: "Error in getting messages" }, { status: 500 });
    }
}