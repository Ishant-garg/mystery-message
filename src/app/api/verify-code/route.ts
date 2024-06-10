import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    
    await dbConnect();

    try {
        const {username , code} = await request.json();

        const user = await  UserModel.findOne({username  });
        
        if(!user){
            return Response.json({success: false, message: "User not found"} , {status : 400});
        }

        if(user.verifyCode === code && user.verifyCodeExpires > new Date()){
            user.isVerified = true;
            await user.save();
            return Response.json({success: true, message: "Code verified successfully"} , {status : 200});
        }
        else if(user.verifyCodeExpires < new Date()){
            return Response.json({success: false, message: "Code expired"} , {status : 400});
        }
        else{
            return Response.json({success: false, message: "Invalid code"} , {status : 400});
        }


    
    } catch (error) {
        
        return Response.json({success: false, message: "Internal server error"} , {status : 500});
    }
}