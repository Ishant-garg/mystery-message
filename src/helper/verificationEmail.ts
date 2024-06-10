import { ApiResponse } from "@/app/types/ApiResponse";
import resend from "@/lib/resend";
import VerificationEmail from "../../emails/Verificationemail";


export const sendVerificationEmail = async (username: string, verifyCode: string , email : string) : Promise<ApiResponse> => {
    try{
        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react : VerificationEmail({username , otp : verifyCode })
          });
        return  {success: true, message: "Verification email sent"}
    }
    catch(error){
        console.log("error in sending verification code",error);
        return {success: false, message: "Failed to send verification email"}
    }
}