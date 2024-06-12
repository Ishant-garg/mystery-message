import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { format, parseISO } from 'date-fns';
import axios, { AxiosError } from "axios";
import { useToast } from "../use-toast";
import { ApiResponse } from "@/app/types/ApiResponse";

const formatDate = (isoString : any) => {
  const date = parseISO(isoString);
  return format(date, 'MMM dd, yyyy h:mm a');
};
export const CardComponent = ({content , createdAt , messageId , fetchMessages} : {content : string , createdAt : Date , messageId : string , fetchMessages : Function}) => {
  const formattedDate = formatDate(createdAt);
  const {toast} =   useToast()
  const handleonClick = async () => {
    
    try{
      const respose = await axios.post('/api/delete-message' , {
        // @ts-ignore
        messageId : messageId
      })

      fetchMessages(true);
      toast({
        title: "Message Deleted",
        description: respose.data.message,
      });
    }
    catch(error){
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      })
    }
   

  }
  return (
    <Card className="flex w-full pr-2 md:px-6 justify-between  ">
      <div>
      <CardHeader>
        <CardTitle>{content}</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>

      </div>
      <div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="bg-red-500 mt-3 "> <X className="text-white hover:text-black"/></Button>
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
              <AlertDialogAction onClick={() => handleonClick()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};
