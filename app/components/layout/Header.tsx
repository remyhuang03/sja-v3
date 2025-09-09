"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { logoFont } from "@/app/fonts/logoFont";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  
  const navLinks = [
    {
      name: '作品分析器',
      href: '/analyze',
    },
    {
      name: '抄袭对比器',
      href: '/compare',
      disabled: true,
    },
    // {
    //   name: '作品展示',
    //   href: '/project-display',
    // },
    {
      name: '航站楼',
      href: '/nav',
    },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <div className={cn("mr-6 flex items-center space-x-2", logoFont.className)}>
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              width={98} 
              height={19} 
              src='/meta/white-banner-title.svg' 
              alt='SJA Plus'
              className="h-6 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navLinks.map((navLink) => {
              const isActive = !navLink.disabled && isActiveRoute(navLink.href);
              
              return (
                <NavigationMenuItem key={navLink.name}>
                  <NavigationMenuLink asChild>
                    {navLink.disabled ? (
                      <span
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors opacity-50 cursor-not-allowed"
                        )}
                      >
                        {navLink.name}
                        <span className="ml-1 text-xs text-muted-foreground">(未开放)</span>
                      </span>
                    ) : (
                      <Link
                        href={navLink.href}
                        className={cn(
                          "group relative inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          isActive && "text-primary bg-accent/50"
                        )}
                      >
                        {navLink.name}
                        {isActive && (
                          <div className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary transition-all duration-200" />
                        )}
                      </Link>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Navigation Button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          {/* Mobile menu will be added later if needed */}
        </div>
      </div>
    </header>
  );
}
