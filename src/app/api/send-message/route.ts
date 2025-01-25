import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { MessageModel } from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { Message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect();
   const {username,content}=await request.json();
   try{
         const user=await UserModel.findOne({username});
         if(!user){
            return Response.json({
                success:false,
                message:"Not Authenticated",
            },{status:404});
         }
         
         if(!user.isAcceptingMessage){
               return Response.json({
                   success:false,
                   message:"User is not accepting messages",
               },{status:403});
               
         }
         const newMessages={content , createdAt:new Date()};
         user.messages.push(newMessages as Message);
         await user.save();
         return Response.json({
             success:true,
             message:"Message sent successfully",
             messages:user.messages
         },{status:200});
   }catch(error){
        console.log("Error while sending message",error);
        return Response.json({
            success:false,
            message:"Internal server error",
        },{status:500});
   }


}