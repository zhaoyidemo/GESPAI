"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Map, BookOpen, Code, User, LogOut, Settings, Flame, Star } from "lucide-react";

const navItems = [
  { href: "/", label: "今日任务", icon: Home },
  { href: "/map", label: "知识点地图", icon: Map },
  { href: "/learn/recursion", label: "学习", icon: BookOpen },
  { href: "/problem", label: "题库", icon: Code },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container-responsive flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-white">G</span>
          </div>
          <span className="font-bold text-xl hidden sm:block">GESP AI</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {/* Stats */}
          <div className="hidden sm:flex items-center space-x-3 text-sm">
            <div className="flex items-center space-x-1 text-orange-500">
              <Flame className="h-4 w-4" />
              <span className="font-medium">0</span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="h-4 w-4" />
              <span className="font-medium">0 XP</span>
            </div>
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-white">
                    {session?.user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{session?.user?.username}</p>
                  {session?.user?.email && (
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {session.user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  个人中心
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/setup" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  学习设置
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
