"use client";

import {
  ChevronsUpDown,
  CircleUser,
  LogOut,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useGlobalContext } from "@/app/_providers/GlobalContextProvider";
import { useMemo } from "react";
import { logoutProcess } from "@/app/_services/auth";
import { redirect, RedirectType } from "next/navigation";
import Link from "next/link";
import { ToogleTheme } from "../element/toogle-theme";
import { setInitialName } from "@/app/_utils/objectTransformers";
import { Activitylog } from "@/lib/activity-log/client"


async function logoutHandle(websiteId : string, userId : string) {
    
  // LOG ACTIVITY START
  await Activitylog('USER', 'LOGOUT', 'User logout successfully', {
    website_id: websiteId,
    user_id: userId
  })
  // LOG ACTIVITY END
  
  const logout = await logoutProcess()
  if(logout){

    redirect('/login', RedirectType.replace)
  }
}

export function NavUser() {
  const context = useGlobalContext();
  const profileData = context;

  const authUser = profileData?.user;

  const displayedUser = useMemo(() => {
    return {
      id: authUser?.id,
      fullName: authUser?.fullName,
      email: authUser?.email,
      avatar: authUser?.avatar,
      websiteId: authUser?.websiteId,
    };
  }, [authUser]);

  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full">
                {displayedUser?.avatar ?
                  (
                    <AvatarImage src={displayedUser.avatar} alt={displayedUser.fullName ?? ''} />
                  ) : (
                    <AvatarFallback className="rounded-full">
                      {displayedUser?.fullName ? setInitialName(displayedUser.fullName) : ''}
                    </AvatarFallback>
                  )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayedUser?.fullName}</span>
                <span className="truncate text-xs">{displayedUser?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm w-full">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={displayedUser?.avatar ?? ''} alt={displayedUser?.fullName ?? ''} />
                    <AvatarFallback className="rounded-full">
                      {displayedUser?.fullName ? setInitialName(displayedUser.fullName) : ''}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayedUser?.fullName}</span>
                    <span className="truncate text-xs">{displayedUser?.email}</span>
                  </div>
                </div>
                <ToogleTheme />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/backside/account">
                <DropdownMenuItem className="cursor-pointer">
                    <CircleUser />
                    Account
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" 
              onClick={() => logoutHandle(displayedUser?.websiteId ?? '', displayedUser?.id ?? '')}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}