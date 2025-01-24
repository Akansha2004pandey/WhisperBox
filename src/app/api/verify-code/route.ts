import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { decode } from "punycode";
import {z} from "zod";

export async function POST(request:Request){
      await dbConnect();
      try{
         const {username,code}=await request.json();
         // when things are coming from url then just decode them
         const decodedUsername=decodeURIComponent(username);
         const user= await UserModel.findOne({username:decodedUsername});
         if(!user){
             return Response.json({
                success:false,
                message:"user not found"
             },{status:500});
         }
         const isCodeValid=user.verifyCode===code;
         const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date();
         if(isCodeValid && isCodeNotExpired){
               user.isVerified=true;
               await user.save();
               return Response.json({
                success:true,
                message:"User successfully verified"
               },{status:200});

         }
         else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"verification code has expired. please signup again to get a new code"
            },{status:400});
         }else{
            return Response.json({
                success:false,
                message:"verification code is incorrect"
            },{status:400});
         }

      }catch(error){
         console.log(error,"Error verifying user",error);
         return Response.json({
            success:false,
            message:"Error checking username",
            error:error
         },{status:500});
      }
}