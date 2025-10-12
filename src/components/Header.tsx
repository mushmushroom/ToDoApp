'use client';
import Link from 'next/link';
import React from 'react';
import { NavigationMenu, NavigationMenuLink } from './ui/navigation-menu';
import { useSession } from 'next-auth/react';
import LogoutButton from './LogoutButton';

export default function Header() {
  const { data: session } = useSession();

  return (
    <div className="px-1 border-b-2">
      <NavigationMenu className="py-3 max-w-6xl mx-auto w-full font-medium">
        <div className="flex justify-between items-center w-full">
          {/* Left links */}
          <div className="flex gap-3 items-center">
            <NavigationMenuLink asChild>
              <Link href="/">Home</Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link href="/my-tasks">My tasks</Link>
            </NavigationMenuLink>
          </div>

          {/* Right links */}
          <div className="flex gap-3 items-center">
            <NavigationMenuLink asChild>
              <Link href="/settings">Settings</Link>
            </NavigationMenuLink>

            <LogoutButton />
          </div>
        </div>
      </NavigationMenu>
    </div>
  );
}
