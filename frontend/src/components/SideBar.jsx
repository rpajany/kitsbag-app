import React from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Plus,
  Calendar,
  ChevronUp,
  ChevronDown,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
  ProjectorIcon,
  DeleteIcon,
  TableOfContents,
  LayoutDashboard,
  Barcode,
  BaggageClaim,
  NotepadText,
  NotebookText,
  Notebook,
  Blocks,
  Weight,
} from "lucide-react";
// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Bag Master",
    url: "master",
    icon: Inbox,
  },
    {
    title: "Child Master",
    url: "child_master",
    icon: Blocks,
  },
  {
    title: "Order",
    url: "order",
    icon: BaggageClaim,
  },
  {
    title: "Part Label",
    url: "partlabel",
    icon: Barcode,
  },
  {
    title: "WeightLabel",
    url: "weightlabel",
    icon: Weight,
  },

  {
    title: "BinStock",
    url: "bin_stock",
    icon: Blocks,
  },
];

export const SideBar = () => {
  return (
    <Sidebar collapsible="icon" className="relative top-0 left-0 ">
      {/* Dashboard */}
      {/* <SidebarHeader>
        <LayoutDashboard />      
      </SidebarHeader> */}

      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.title == "Inbox" && (
                    <SidebarMenuBadge>10</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Collapse */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="bg-gray-400 px-3">
                <Notebook className="mr-2" />
                Report
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem className="px-6">
                    <SidebarMenuButton asChild>
                      <Link to="/kit_report">
                        <NotepadText />
                        Kit Report
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem className="px-6">
                    <SidebarMenuButton asChild>
                      <Link to="/order_report">
                        <NotepadText />
                        Order Report
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem className="px-6">
                    <SidebarMenuButton asChild>
                      <Link to="/bag_report">
                        <NotepadText />
                        Bag Report
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* nested */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Nested Item</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/#">
                    <ProjectorIcon />
                    Project
                  </a>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <a href="/#">
                        <Plus />
                        Add project
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <a href="/#">
                        <DeleteIcon />
                        Delete project
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      <SidebarSeparator />

      {/* <SidebarFooter className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="" asChild>
                <SidebarMenuButton>
                  <User2 />
                  Pajany <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  );
};
