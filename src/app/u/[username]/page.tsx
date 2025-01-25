"use client"
import { Form, FormControl, FormField, FormItem, FormLabel,FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import  {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import {useDebounceCallback} from "usehooks-ts"
import { useToast } from '@/hooks/use-toast'
import { signUpSchema } from '@/schemas/signUpSchema'
import mongoose, { set } from 'mongoose'
import axios, {AxiosError} from "axios"
import { ApiResponse } from '@/types/ApiResponse'
import {SubmitHandler}    from "react-hook-form"
import { Loader2 } from 'lucide-react'
import { Link } from 'lucide-react'
import { messageValidationSchema } from "@/schemas/messageSchema"
import React, {useState,useEffect} from "react"
import { useSearchParams } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { useParams } from "next/navigation"
import { Message } from "@/model/User"
const page = (
) => {
  const params = useParams<{  username: string }>();
  console.log(params);
   const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages,setMessages]=useState<string[]>([]);
  const [gettingMessages,setGettingMessages]=useState(false);
   const {toast}=useToast();
   const form=useForm<z.infer <typeof messageValidationSchema>>({
        resolver:zodResolver(messageValidationSchema),
        defaultValues:{
            content:'',
        },
    });
    const username=params?.username;
   


   const onSubmit=async (data:z.infer<typeof messageValidationSchema>)=>{
     setIsSubmitting(true);
     
     try{
         const response=await axios.post<ApiResponse>('/api/send-message',{
           username:username,
           content:data?.content,
         });
         toast({
           title:'Success',
           description:response.data.message,
         })
         form.reset({content:''});
         
     }catch(err){
         console.log("error in sign up of user");
         const axiosError=err as AxiosError<ApiResponse>;
         let errorMessage=axiosError.response?.data.message;
         toast({
            title:'Error',
            description:errorMessage,
            variant:"destructive",
         })
         
        
     }finally{
       setIsSubmitting(false);
     }
   }
   const suggestMessages=async ()=>{
     setGettingMessages(true);
      try{
         const response=await axios.post('/api/suggest-messages');
         const suggestedMessages=response?.data?.messages.split('||') ;
         console.log(suggestedMessages);
         setMessages(suggestedMessages);
         console.log(messages);
         
         
        
         
         toast({
            title:'Success',
            description:'Suggested messages',
            
         })

      }catch(err){
         console.log("error in suggest messages");
         const axiosError=err as AxiosError<ApiResponse>;
         let errorMessage=axiosError.response?.data.message;
         toast({
            title:'Error',
            description:errorMessage,
            variant:"destructive",
         })
         
        
     }finally{
       setGettingMessages(false);
     }
   }
   useEffect(()=>{
      suggestMessages();
   },[])
  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-gray">
      <div className='text-3xl font-bold mt-10 mb-10 text-center'>Public Profile</div>

      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/4 min-w-[300px]" >
      <FormField
  control={form.control}
  name="content"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-md">Sent message to @{username}</FormLabel>
      <FormControl>
        <Textarea {...field} className="w-full min-w-[300px] min-h-[150px]" />
      </FormControl>
      
      <FormMessage />
    </FormItem>
    
  )}
/>
<Button type="submit" disabled={isSubmitting} className="mt-6">
    Send Message
</Button>
</form>
     
</Form>


<div className="w-3/4 mt-10 flex flex-col justify-center items-center space-y-6 pb-20">
  <Button
    onClick={() => suggestMessages()}
    disabled={gettingMessages}
    className={`px-6 py-2 text-white font-medium rounded-md ${
      gettingMessages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
    }`}
  >
    Suggest Messages
  </Button>

  <div className="flex flex-col gap-5 w-full ">
    {messages.map((msg, index) => (
      <div
        key={index}
        className="py-4 px-5 w-full bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
      >
        {msg}
      </div>
    ))}
  </div>
</div>

    </div>
  )
}

export default page
