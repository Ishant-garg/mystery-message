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
    <div className='border-b-2'>
      <div className='flex justify-around container py-3'>
        <div>
          <h1 className='text-3xl font-extrabold'>Mystery Message</h1>
        </div>
        <div className='my-auto flex gap-4'>
          {session ? (
            <div className='flex gap-6'>
              <div className="text-xl my-auto">Welcome, {user.username}</div>

              <Button onClick={() => signOut()}>Logout</Button>
              
            </div>
          ) : (
            <Link href='/sign-up'>
             
                <Button>Sign Up</Button>
          
            </Link>
          )}<ModeToggle/>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
