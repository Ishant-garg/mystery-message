 
import mongoose , {Document} from "mongoose";

export interface  IMessage extends Document{
    content: string,
    createdAt: Date
}
export interface IUser extends Document{
    username: string,
    email: string,
    password: string,
    messages: [IMessage],
    verifyCode: string,
    verifyCodeExpires: Date,
    isAcceptingMessages: boolean,
    isVerified: boolean
}

const MessageSchema = new mongoose.Schema<IMessage>({
    content : {
        type: String,
        required: [true, "Message content is required"],
        minlength: [10, "Message must be at least 10 characters long"],
        MaxLength : [300, "Message must be at most 300 characters long"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const UserSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],

    },
    messages: [MessageSchema],
    verifyCode :{
        type: String,
        required: [true, "Verification code is required"],
    },
    verifyCodeExpires: {
        type: Date,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: false 
    },
    isVerified : {
        type: Boolean,
        default: false
    }
})


const UserModel = mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>("User", UserSchema);

export default UserModel;

