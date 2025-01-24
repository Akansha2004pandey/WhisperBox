import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number;
}
const connection:ConnectionObject={}

async function dbConnect():Promise<void>{
        if(connection.isConnected){
             console.log("already connected to database");
             return ;
        }
        try{
           const db=await mongoose.connect(process.env.MONGODB_URI || '',{})
           connection.isConnected=db.connections[0].readyState
           console.log("db connected successfully");
        }catch(err){
             console.log("database connection failed",err);
             process.exit(1);

        }

    
}
export default dbConnect;