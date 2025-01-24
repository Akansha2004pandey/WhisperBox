import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema=z.object({
    username:usernameValidation,
})
export async function GET(request:Request){
   // console.log(request.method,"request method"); next handles
    // if(request.method!=="GET"){
    //     return Response.json({
    //         success:false,
    //         message:"Method not allowed",
    //     },{status:405});
    // }
    await dbConnect();
    try{
        console.log(request.url,"request url");
        const {searchParams}=new URL(request.url);
        console.log(searchParams,"hello");
        const queryParam={
            username:searchParams.get("username"),
        }
        //validate with zod
        const result=UsernameQuerySchema.safeParse(queryParam);
      // if safe parsing then you will receive the value else u will not

       console.log(result); // to do remove
       if(!result.success){
            const usernameErrors=result.error.format().username?._errors || [];
            console.log(usernameErrors,"usernameErrors");
            // this result.errors has a lot of errors ... we need to extract only username errors
            return Response.json({
                 success:false,
                 message:usernameErrors?.length>0?usernameErrors.join(","):"Invalid query parameters",
            },{status:500});
       }
       const {username}=result.data;

       const existingVerifiedUser=await UserModel.findOne({username:username,isVerified:true});
       if(existingVerifiedUser){
            console.log("already in db");
             return Response.json({
                success:false,
                message:"Username is already taken",
                
             },{status:500});
       }
       return Response.json({
        success:true,
        message:"Username is unique",

       },{status:200});
       
        
    }catch(error){
         console.log(error, "Error checking username");
         return Response.json({
            success:false,
            message:"Error checking username",
            error:error
         },{status:500});
    }
}

