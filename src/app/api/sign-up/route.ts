import { sendVerificationEmail } from "@/helper/verificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    await dbConnect();

    try{
        const {username, email, password} = await request.json();

        const existingUserVerifiedByUsername = await  UserModel.findOne({username , isVerified : true});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserVerifiedByUsername){
                return Response.json({success: false, message: "User already exists"} , {status : 400});
        }
        
        const existingUserVerifiedByEmail = await UserModel.findOne({email});
        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return Response.json({success: false, message: "User already exists"} , {status : 400});
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpires = expiryDate;
                existingUserVerifiedByEmail.password = hashedPassword;
                await existingUserVerifiedByEmail.save();

                // return Response.json({success: true, message: 'User Registerd successfully'} , {status : 200});
            }
        }
         else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const user = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpires : expiryDate,
                isAcceptingMessages : true,
                messages : [],
                isVerified : false
            });
            user.save();

         }
        // //sending verification email
        const emailResponse = await sendVerificationEmail(username, verifyCode, email);

        console.log('emailResponse',emailResponse);

        if(!emailResponse.success){
            return Response.json({success: false, message: emailResponse.message} , {status : 500});
        } 
        return Response.json({success: true, message: 'User Registerd successfully . Please verify your email'} , {status : 200});
    }
    catch(error){
        console.log('error in signing up',error);
        return Response.json({success: false, message: "Failed to sign up"} , {status : 500});
    }

}