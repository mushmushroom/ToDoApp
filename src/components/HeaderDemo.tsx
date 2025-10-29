'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { NavigationMenu, NavigationMenuLink } from './ui/navigation-menu';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { AppPath, headerLinks } from '@/lib/links';
import { Button } from './ui/button';
import { FaBars } from 'react-icons/fa';

export default function HeaderDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="px-1 border-b-2">
      {/* Desktop menu */}
      <NavigationMenu className="hidden md:block py-3 max-w-6xl mx-auto w-full font-medium">
        <div className="flex justify-between items-center w-full">
          {/* Left links */}
          <div className="flex gap-3 items-center">
            <NavigationMenuLink asChild className="text-xl">
              <Link href={AppPath.Home}>
                <Image src="/cover.png" alt="Logo img" width={120} height={60} />
              </Link>
            </NavigationMenuLink>
            {headerLinks.rightLinks.map((link) => (
              <NavigationMenuLink asChild key={link.href} className="text-xl">
                <span>{link.text}</span>
              </NavigationMenuLink>
            ))}
          </div>
          <div>
            <p className="text-blue-500">Demo version</p>
          </div>
        </div>
      </NavigationMenu>

      {/* Mobile menu */}
      <div className="md:hidden text-xl py-3 flex justify-between items-center">
        <Link href={AppPath.Home} className="text-lg">
          <Image src="/cover.png" alt="Logo img" width={120} height={60} />
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetHeader className="sr-only">
            <SheetTitle className="text-left">Mobile Menu</SheetTitle>
          </SheetHeader>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <FaBars style={{ width: '2rem', height: '2rem' }} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <NavigationMenu className="flex-col  max-w-full w-full h-full py-9 px-3 justify-start gap-3">
              {headerLinks.rightLinks.map((link) => (
                <NavigationMenuLink asChild key={link.href} className="text-xl">
                  <span>{link.text}</span>
                </NavigationMenuLink>
              ))}
              <div>
                <p className="text-blue-500">Demo version</p>
              </div>
            </NavigationMenu>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
