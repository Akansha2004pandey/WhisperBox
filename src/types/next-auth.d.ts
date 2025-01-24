import 'next-auth'
import { DefaultSession } from 'next-auth';
// redefine or modify declared modules
declare module 'next-auth'{
      interface User{
           _id?:string;
           isVerified?:boolean;
           isAcceptingMessgages?:boolean;
           username?: string;
      }
      interface Session{
         user:{
            _id?:string;
            isVerified?:boolean;
            isAcceptingMessages?:boolean;
            username?:string;
         }& DefaultSession['user'];

      }
}
// another method using declare module JWT
declare module 'next-auth/jwt'{
    interface JWT{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }
}   
