"use client";

import { VerifySchema } from "@/app/Schemas/VerifyCode";
import { ApiResponse } from "@/app/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
const Page = () => {
  const params  = useParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
  });
  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
    console.log('params',params);
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        //@ts-ignore
        username: params.username,
        code: data.code,
      });

      toast({
        title: "success",
        description: response.data.message,
      });
      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ||
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 ">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg  shadow-md">
      <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl dark:text-black mb-4">
          Verify Your Account

          </h1>
          <p className="dark:text-black">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-black">Code</FormLabel>
                  <FormControl>
                    <Input className="dark:bg-white dark:text-black" placeholder="Enter code" {...field} />
                  </FormControl>

                
                </FormItem>
              )}
            />
        
            <Button  className="w-full " type="submit" >
                Submit
            </Button>
          </form>
        </Form>
    
      </div>
    </div>
  );
};

export default Page;
