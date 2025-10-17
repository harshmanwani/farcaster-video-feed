"use client"

import { 
  Home, 
  Search, 
  ShoppingBag, 
  Compass, 
  Users, 
  Tv, 
  Plus, 
  User, 
  MoreHorizontal
} from "lucide-react"
import { NeynarAuthButton } from "@neynar/react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import FarcasterIcon from "@/components/icons/farcaster"

const navigationItems = [
  {
    title: "For You",
    icon: Home,
    isActive: true,
  },
  {
    title: "Shop",
    icon: ShoppingBag,
    badge: "1",
  },
  {
    title: "Explore",
    icon: Compass,
  },
  {
    title: "Following",
    icon: Users,
  },
  {
    title: "LIVE",
    icon: Tv,
  },
  {
    title: "Upload",
    icon: Plus,
  },
  {
    title: "Profile",
    icon: User,
  },
  {
    title: "More",
    icon: MoreHorizontal,
    badge: "1",
  },
]

const footerItems = [
  "Company",
  "Program", 
  "Terms & Policies",
  "© 2025 FarTok"
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" className="bg-white dark:bg-black">
      <SidebarHeader className="p-5">
        <div className="mb-5 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-4">
            <FarcasterIcon width={32} height={32} />
            <div className="flex flex-col">
              <span className="text-black dark:text-white font-bold text-2xl leading-tight">FarTok</span>
              <span className="text-gray-500 dark:text-gray-400 text-[10px] font-medium tracking-wide">TikTok-style feed for Farcaster</span>
            </div>
          </div>
        </div>
        
        <div className="relative group-data-[collapsible=icon]:hidden">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-full px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={item.isActive}
                    className={`${
                      item.isActive 
                        ? 'text-red-500 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700' 
                        : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    } group-data-[collapsible=icon]:justify-center rounded-lg`}
                  >
                    <a href="#" className="flex items-center gap-4 py-3.5 px-3">
                      <item.icon className={`w-7 h-7 ${item.isActive ? 'text-red-500' : 'text-black dark:text-white'}`} />
                      <span className="text-lg font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="bg-red-500 text-white text-sm group-data-[collapsible=icon]:hidden">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="px-3 mt-4 group-data-[collapsible=icon]:hidden">
          <NeynarAuthButton />
        </div>
      </SidebarContent>

      <SidebarFooter className="p-5">
        <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
          {footerItems.map((item, index) => (
            <div key={index} className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">
              {item}
            </div>
          ))}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
