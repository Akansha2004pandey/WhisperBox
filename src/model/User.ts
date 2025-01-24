import mongoose,{Schema, Document} from "mongoose";
/*document is used as we are using typescript hence type safety*/
/*to define type interface is written*/

export interface Message extends Document{
    content:string;
    createdAt:Date;

}

const MessageSchema:Schema<Message>=new Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now,
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[] // messages from message array feeded as document
}

const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"] ,
        unique:true,
        match:[/.+\@.+\..+/,'please use a valid email address']
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"verify code is required"],

    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verify code expiry is required"],

    },
    isVerified:{
       type:Boolean,   
       default:false,
       required:true
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true,
    },
     messages:[MessageSchema]

})

export const UserModel=(mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema));

export const MessageModel=(mongoose.models.Message as mongoose.Model<Message>) || (mongoose.model<Message>("Message",MessageSchema));