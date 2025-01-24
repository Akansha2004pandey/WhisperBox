import {getServerSession} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/model/User";
import {User} from "next-auth";

export async function POST(request:Request){
    await dbConnect();

    const session=await getServerSession(authOptions);
    const user:User=session?.user as User;
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"You are not logged in",
        },{status:401});
    }
    const userId=user._id;
    const {acceptMessages}=await request.json();
    try{
        const updatedUser=await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage:acceptMessages,
        },{new:true});  // by doing so you will receive updated value
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"Error while updating accept messages",
            },{status:401})
        }
        return Response.json({
            success:true,
            message:"Accept messages updated successfully",
            updatedUser
        
        },{status:200})
        

         
    }catch(error){
         console.log("failed to update user staus to update emssages")
         return Response.json({
            success:false,
            message:"Error while updating accept messages",
         },{status:500})
    }


}

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
    const userId=user._id;
    try{
        const reqUser=await UserModel.findById(userId);
        if(!reqUser){
            return Response.json({
                success:false,
                message:"User not found",
            },{status:404})
        }
        return Response.json({
            success:true,
            message:"Accept messages fetched successfully",
            isAcceptingMessages:reqUser?.isAcceptingMessage,
        },{status:200})
    }catch(error){
        console.log("Error while fetching accept messages");
        return Response.json({
            success:false,
            message:"Error while fetching accept messages",
        },{status:500}) 
    }
}