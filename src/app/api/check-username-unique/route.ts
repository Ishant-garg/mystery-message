import { UsernameValidation } from "@/app/Schemas/SignUpSchema";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";


const checkUsernameUniqueSchema = z.object({
    username : UsernameValidation
})
export async function GET(request: Request) {
    await dbConnect();

    try{
        const {searchParams} =  new URL(request.url);
        const queryParam = {
            username : searchParams.get('username')
        }
        
        const result = checkUsernameUniqueSchema.safeParse(queryParam);
        console.log('result',result);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            // console.log(usernameErrors)
            return Response.json({success: false , message : usernameErrors[0]} , {status : 400});
        }
        const {username} = result.data;
        const existingUser = await  UserModel.findOne({username , isVerified : true});
        if(existingUser){
            return Response.json({success: false , message : "User already exists with this username"} , {status : 400});
        }
        

         return Response.json({success: true  , message : 'Username is available'} , {status : 200});
    }
    catch(err){
        return Response.json({success: false , message: "Internal server error"} , {status : 500});
    }

}