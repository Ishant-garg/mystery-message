import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { IMessage } from "@/model/User";
export async function POST(request: Request) {

    await dbConnect();

    const {username , content} = await request.json();

  
    try{
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }
        if(!user.isAcceptingMessages){
            return Response.json({ success: false, message: "User is not accepting messages" }, { status: 400 });
        }
        const newMessage = {
            content,
            createdAt : new Date()
        }
        user.messages.push(newMessage as IMessage);
        await user.save();

        return Response.json({ success: true, message: "Message sent successfully" }, { status: 200 });
    }
    catch(err){
        // console.log(err)
        return Response.json({ success: false, message: "Error in sending message" }, { status: 500 });
    }
}