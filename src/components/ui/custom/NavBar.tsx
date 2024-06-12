"use client";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button"; // Adjust the import path to your project's structure
import { LogOut } from 'lucide-react';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

const NavBar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <div className='border-b-2 bg-slate-900 text-white'>
      <div className='flex justify-between container md:py-5 py-2' >
        <div>
          <h1 className='md:text-3xl text-xl font-extrabold'>Mystery Message</h1>
        </div>
        <div className='my-auto flex gap-4'>
          {session ? (
            <div className='flex gap-6'>
              <div className="md:text-xl text-sm   my-auto">Welcome, {user.username}</div>

              <Button className="bg-black border-2 border-white[0.5] dark:bg-white" onClick={() => signOut()}>Logout</Button>
              
            </div>
          ) : (
            <Link href='/sign-up'>
             
                <Button >Sign Up</Button>
          
            </Link>
          )}<ModeToggle/>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
