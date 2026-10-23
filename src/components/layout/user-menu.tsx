"use client";

import { Monitor, Moon, Settings2, Sun, UserRound } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserSummary } from "@/types";

export function initials(user: Pick<UserSummary, "firstName" | "lastName">): string {
  return `${user.firstName.charAt(0)}${user.lastName?.charAt(0) ?? ""}`.toUpperCase();
}

export function UserMenu({ user, align = "end" }: { user: UserSummary; align?: "start" | "end" }) {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full transition-transform duration-200 hover:scale-105 focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none active:scale-95"
        aria-label="Menu du compte"
      >
        <Avatar className="size-9">
          {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
          <AvatarFallback>{initials(user)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-60">
        <DropdownMenuLabel className="flex flex-col gap-0.5 pb-2">
          <span className="text-sm font-semibold text-foreground">
            {user.firstName} {user.lastName}
          </span>
          <span className="truncate font-normal">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/parametres">
            <UserRound /> Profil financier
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/parametres">
            <Settings2 /> Paramètres
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Apparence</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">
            <Sun /> Clair
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon /> Sombre
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor /> Système
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
