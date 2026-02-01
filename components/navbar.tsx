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
import {
  Home,
  Map,
  BookOpen,
  Code,
  User,
  LogOut,
  Settings,
  Flame,
  Star,
  Sparkles,
  Database,
  BookX,
} from "lucide-react";

const navItems = [
  { href: "/", label: "今日任务", icon: Home },
  { href: "/map", label: "知识点", icon: Map },
  { href: "/learn/recursion", label: "学习", icon: BookOpen },
  { href: "/problem", label: "题库", icon: Code },
  { href: "/error-book", label: "错题本", icon: BookX },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full glass-navbar">
      <div className="container-responsive flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-primary via-accent to-primary rounded-xl opacity-30 blur group-hover:opacity-50 transition-opacity -z-10" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-lg leading-none gradient-text">
              GESP AI
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              智能备考助手
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                <span className="hidden md:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Stats */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-500/10">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-semibold text-orange-600 stat-number">
                0
              </span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-600 stat-number">
                0
              </span>
            </div>
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 hover:bg-secondary/80"
              >
                <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                    {session?.user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-card" align="end" sideOffset={8}>
              <div className="flex items-center gap-3 p-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                    {session?.user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5">
                  <p className="font-semibold text-sm">{session?.user?.username}</p>
                  {session?.user?.email && (
                    <p className="text-xs text-muted-foreground truncate max-w-[160px]">
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
              <DropdownMenuItem asChild>
                <Link href="/admin/problems" className="cursor-pointer">
                  <Database className="mr-2 h-4 w-4" />
                  题库管理
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
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
