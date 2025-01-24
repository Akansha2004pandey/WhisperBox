"use client"
import React from 'react'
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from './ui/card'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Button } from "./ui/button"
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
type MessageCardProps={
  message:Message;
  onMessageDelete:(messageId:string)=>void;
}
const MessageCard = ({message, onMessageDelete}:MessageCardProps) => {
   const {toast}=useToast();
   const handleDeleteConfirm=async ()=>{
    const result=await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
    toast({
      title: 'Message Deleted',
      description: 'Your message has been deleted.',
    })
    onMessageDelete(message._id as string);

  }
    return (
    <div>
      <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className='h-5 w-5'/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleDeleteConfirm()}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>

    </div>
  )
}

export default MessageCard