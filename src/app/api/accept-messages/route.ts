import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";





export   async function POST(request: Request) {
    dbConnect();

    const session = await getServerSession(AuthOptions);
    
    if (!session) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
        
    const user = session.user;
    if(!user){
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = user._id;
    const {acceptMessages} = await request.json();

    try {
        const UpdatedUser = await UserModel.findByIdAndUpdate(userId 
        , {isAcceptingMessages : acceptMessages} , {new : true});

        if(!UpdatedUser){
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "User updated successfully" }, { status: 200 });
        
    } catch (error) {
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
    }

}


export   async function GET(request: Request) {
    dbConnect();
    const session = await getServerSession(AuthOptions);
    
    if (!session) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
        
    const user = session.user;
    if(!user){
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return Response.json({ success: true, isAcceptingMessages : foundUser.isAcceptingMessages }, { status: 200 });
    }
    catch(error){
        return Response.json({ success: false, message: "Error in getting message acceptance status" }, { status: 500 });
    }

}