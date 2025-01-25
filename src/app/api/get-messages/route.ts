import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { MessageModel } from "@/model/User";
import { NextRequest } from "next/server";
import {User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
export async function GET(request:Request){
    await dbConnect();
    const session=await getServerSession(authOptions);
    const user:User=session?.user as User;
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"You are not logged in",
        },{status:401});
    }
    console.log("session",session);
    const userId=new mongoose.Types.ObjectId(user._id);
    

    try{
            // while using aggregation pipeline 
            // before in declare (Types) we converted token id toString()
           const user=await UserModel.aggregate([
             {
                $match:{_id:userId}
             },
             {$unwind:"$messages"},
             {
                $sort:{'messages.createdAt':-1}
             },{
                $group:{_id:'$_id',messages:{$push:'$messages'}}
             }
           ])
           console.log("user",user);
           // messages pushed after being sorted
           if(!user || user.length===0){
               return Response.json({
                   success:false,
                   message:"Not Authenticated",
               },{status:404})
           }
           return Response.json({
               success:true,
               message:"Messages fetched successfully",
               messages:user[0].messages,
           },{status:200})
    }
    catch(error){
        console.log("Error while fetching messages");
        return Response.json({
            success:false,
            message:"Error while fetching messages",
        },{status:500})
    }
    
}
