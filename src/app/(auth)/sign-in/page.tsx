"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { SignInSchema } from "@/app/Schemas/SignInSchema";
import { signIn } from "next-auth/react";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { 
      email: "",
      password: ""
    },
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    setIsLoading(true);
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,  // Ensure redirect is false to handle errors on the same page
    });

    setIsLoading(false);
    if (result?.error) {
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
      });
    } else if (result?.url) {
      toast({
        title : "Login Success",
        description: "You are now logged in",
        
      })
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 ">
      <div className="w-full max-w-md p-6 space-y-6 mx-3 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold dark:text-black tracking-tight lg:text-5xl mb-4">
            Login True Feedback
          </h1>
          <p className="dark:text-black">Login to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="md:space-y-8 space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" dark:text-black">Email</FormLabel>
                  <FormControl>
                    <Input className="dark:bg-white dark:text-black" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel  className=" dark:text-black">Password</FormLabel>
                  <FormControl>
                    <Input className="dark:bg-white dark:text-black" placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full dark:bg-black dark:text-white" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="mt-2 text-center text-sm dark:text-black">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline ">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
