"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { navigationLinks } from '@/lib/agents';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar">
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-lg font-headline text-sidebar-foreground"
        >
          <BrainCircuit className="h-7 w-7 text-primary" />
          <span className="group-data-[collapsible=icon]:hidden">AfgAiHub</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationLinks.map((link) => (
            <SidebarMenuItem key={link.name}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={link.name}
                className={cn(
                  'justify-start',
                  pathname === link.href && 'bg-sidebar-accent'
                )}
              >
                <Link href={link.href}>
                  <link.icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
