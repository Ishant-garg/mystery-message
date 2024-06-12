"use client"
import { acceptMessageSchema } from "@/app/Schemas/acceptMessageSchema";
import { ApiResponse } from "@/app/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {Button} from "@/components/ui/button";
import { CardComponent } from "@/components/ui/custom/CardComponent";
import { IMessage } from "@/model/User";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
 
 
const Page = () => {
  const [messages , setMessages] = useState([]);
  const [isLoading , setIsLoading] = useState(false);
  const [isSwitchLoading , setIsSwitchLoading] = useState(false);

  const { toast } = useToast();
    const handleDeleteMessage = (messageId : string) => {
    //@ts-ignore
      messages.filter((message) => message?._id !== messageId);
    }

  const {data : session} = useSession();

  const form = useForm({
    resolver : zodResolver(acceptMessageSchema)  
  })

  const {watch , register , setValue} = form

  

  const acceptMessages = watch("acceptMessage");
  
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessage" , response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error11",
        description: axiosError.response?.data.message,
        variant: "destructive",
      })
    }
    finally{
      setIsSwitchLoading(false);
    }
  } ,[setValue , setIsSwitchLoading] )

  const fetchMessages = useCallback(async (refresh : boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false)
    try {
      const response = await axios.get ("/api/get-messages");
      console.log(response.data);
      setMessages(response.data.messages || []);
      if(refresh){
        toast({
          title: "Success",
          description: "Messages refreshed successfully",
         
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error00",
        description: axiosError.response?.data.message,
        variant: "destructive",
      })
    }
    finally{
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  } , [setIsLoading , setMessages ])

  useEffect(()=>{
    if(!session || !session.user){
      return;
    }

    fetchAcceptMessages();
    fetchMessages();

  },[session , fetchAcceptMessages , fetchMessages ]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try{
      const response = await axios.post("/api/accept-messages" , {
        acceptMessages : !acceptMessages
      })
      setValue("acceptMessage" , !acceptMessages);
      toast({
        title: "Success",
        description: "Accept status updated successfully",
       
      })
    }
    catch{
      //@ts-ignore
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      })
   
    }
    finally{
      setIsSwitchLoading(false);
    }
  }

  const username = session?.user?.username;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const uniqueUrl = `${baseUrl}/u/${username}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(uniqueUrl);
    toast({
      title: "Copied",
      description: "Link copied to clipboard",
      variant: "success",
    })
  }

   
 
  if(!session || !session.user){
    return null
  }

  return (
    <div className="md:w-[1180px] w-[93%] mx-auto mt-8">
       
      <div className="text-xl font-extrabold md:text-4xl">User Dashboard</div>

      <div><p className="text-xl mt-4 font-bold">Copy your unique link</p></div>
      <div className="flex mt-3 " >
        <input className="w-full bg-slate-100 dark:bg-slate-500 p-2 rounded-md outline-none" type="text" value={uniqueUrl} readOnly />
        <Button onClick={()=>copyToClipboard()}>Copy</Button>
      </div>


      <div className="my-4"> 
        <Switch 
        {...register("acceptMessage")}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
        <Separator/>
      
      <Button 
        className="my-4"
        variant="outline"
      onClick={(e) =>{
        e.preventDefault();
        fetchMessages(true);
      }}>
        {isLoading ? < Loader2 className="animate-spin"/> : <RefreshCw/>}
      </Button>
      
      <div>

        {
          (messages.length > 0) 
          ? 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {
               messages.map((message : IMessage) => (
                //@ts-ignore
                <CardComponent content={message.content} key={message._id} fetchMessages={fetchMessages} messageId = {message._id} createdAt={message.createdAt} />
              )) 
            }
          </div>
          : <div>No messages</div>
            
          
        }
      </div>
    </div>
  )
}

export default Page 