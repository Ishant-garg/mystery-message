"use client";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import axios , { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { SignUpSchema } from "@/app/Schemas/SignUpSchema";
import { useRouter } from "next/navigation";
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
import { Loader, Loader2 } from "lucide-react";
import Link from "next/link";
import { ApiResponse } from "@/app/types/ApiResponse";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");

   const [isLoading, setIsLoading] = useState(false);
  const [isSetingUsername, setIsSetingUsername] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  const decoded = useDebounceCallback(setUsername, 300);
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsSetingUsername(true);
        setUsernameMessage("");

        try {
          const result = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(result.data.message);
          console.log(result); 
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            setUsernameMessage(
                axiosError.response?.data.message ?? 'Error checking username'
            );
        } finally {
          setIsSetingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/sign-up", data);

      if (response.data.success === true) {
        toast({
          title: "Account created",
          description: response.data.message,
        });
      }
      router.replace("/verify/" + data.username);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 ">
      <div className="w-full max-w-md p-6  space-y-6 mx-3 bg-white rounded-lg  shadow-md">
      <div className="text-center">
          <h1 className="text-3xl dark:text-black font-extrabold tracking-tight lg:text-5xl mb-4">
            Join True Feedback
          </h1>
          <p  className="dark:text-black">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="md:space-y-8 space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-black" >Username</FormLabel>
                  <FormControl>
                    <Input className="dark:bg-white dark:text-black"
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        decoded(e.target.value);
                      }}
                    />
                  </FormControl>
                    <p className={`text-sm absolute ${usernameMessage === 'Username is available' ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-black">Email</FormLabel>
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
                  <FormLabel className="dark:text-black" >Password</FormLabel>
                  <FormControl>
                    <Input  className="dark:bg-white dark:text-black" placeholder="Password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full  dark:bg-black dark:text-white" type="submit" disabled={isLoading}>
                {isLoading ?  <Loader2 className="animate-spin"/> : "Sign Up"}
            </Button>
          </form>
        </Form>
        <div className="mt-2 text-center text-sm dark:text-black">
          Already have an account?{" "}
        
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
