'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSchema } from '@/app/Schemas/messageSchema';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ApiResponse } from '@/app/types/ApiResponse';
import { z } from 'zod';
import Link from 'next/link';

const Page = () => {
  const { username } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
   const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [MessagesValue , setMessagesValue] = useState('');

  const form = useForm({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (data : z.infer<typeof MessageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/send-message', {
        content: data.content,
        username: username,
      });
      toast({
        title: "Message Sent",
        description: response.data.message,
      });
      form.reset(); // Reset form after successful submission
      setMessagesValue(''); // Clear state after successful submission
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSuggestion = async () => {
    setIsSuggestionLoading(true);
 
    try {
      const response = await axios.post('/api/suggest-messages');
      console.log(response.data)
      setSuggestion(response.data.text);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
      });
    }  
    finally{
      setIsSuggestionLoading(false);
    }
  }

  const handleSetMessage = (msg : any) => {
    setMessagesValue(msg);
    form.setValue('content', msg); // Update form value
  }

  const msgArr = suggestion.split('||');
 

  return (
    <div className='container'>
      <div className='container flex flex-col items-center mt-12 h-fit'>
        <h1 className='text-4xl font-bold'>Public Profile Link</h1>
        <div className='w-[98%] md:w-[900px] flex flex-col gap-4 mt-4'>
          <p className='text-start font-semibold'>Send Anonymous Message to @{username}</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="content"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message here"
                        className="w-full resize-none"
                        {...field}
                        value={MessagesValue}
                        onChange={(e) => {
                          setMessagesValue(e.target.value);
                          field.onChange(e);
                        }} // Update state and form field
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="text-red-600">{fieldState.error.message}</p>
                    )}
                  </FormItem>
                )}
              />
              <Button className='items-center my-5 flex justify-center mx-auto' type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className='animate-spin h-4 w-4' /> : "Send Message"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <div className='w-[98%] md:w-[900px] mx-auto mt-5'>
        <Button onClick={handleSuggestion}>
          {isSuggestionLoading ? <Loader2 className='animate-spin h-4 w-4' /> : "Suggest Message"}
        </Button>
      </div> 

      {
       
       <div className='border-2 w-[98%] md:w-[800px] mx-auto p-6 mt-4 rounded-md'>
        Messages
        {msgArr.map((msg, index) => (
          <Button onClick={() => handleSetMessage(msg)} className='w-full text-balance h-fit  my-1' variant={"outline"} key={index}>{msg}</Button>
        ))
        } 
      </div>
   
      }

      <div className=' flex justify-center flex-col items-center mx-auto p-6 mt-4 rounded-md '>
        <p className=' mb-4'>Get Your Message Board
        </p>
        <Link  href={'/sign-up'}>
        <Button>Create Your Account</Button>
        </Link> 
      </div>
    </div>
  );
}

export default Page;
