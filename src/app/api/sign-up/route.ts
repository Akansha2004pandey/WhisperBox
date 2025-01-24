import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    
    await dbConnect();
    console.log("db connected");

    try{
        const { username, email, password } = await req.json();
        const existingUserVerifiedByUsername=await UserModel.findOne({
             username,
             isVerified:true
         })
         if(existingUserVerifiedByUsername){
            return Response.json({
                success:false, //false because user is already registered 
                message:"User Already Exists"
            },{status:400})
         }
        const existingUserByEmail=await UserModel.findOne({email});
        const verifyCode=Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserByEmail){
             if(existingUserByEmail.isVerified){
                 return Response.json({
                     success:false,
                     message:"User Already Exists with thisemail"
                 },{status:500})
             }else{
                  const hashedPassword=await bcrypt.hash(password,10);
                  existingUserByEmail.password=hashedPassword;
                  existingUserByEmail.verifyCode=verifyCode;
                  existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000);
                  await existingUserByEmail.save();




             }
        }else{   
            const hashedPassword=await bcrypt.hash(password,10);
            
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours()+1);
            const newuser= new UserModel({
                    username:username,
                    email:email,
                    password:hashedPassword,
                    verifyCode:verifyCode,
                    verifyCodeExpiry:expiryDate,
                    isVerified:false, // not verified yet
                    isAcceptingMessage:true,
                    messages:[]
            })
            await newuser.save();
        }
       
        const emailResponse=await sendVerificationEmail(email,username,verifyCode);
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }
        return Response.json({
            success:true,
            message:"User registered successfully. Please verify your email."
        },{status:200})

    }catch(error){
        console.log("error registering user",error);
        return Response.json({
            success:false,
            message:"Error registering user",

        },{
            status:500
        })
    }
}