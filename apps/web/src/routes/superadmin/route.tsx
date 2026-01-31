import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import { LanguageToggle } from "@/components/language-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarLayout,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Users,
  Building,
} from "lucide-react"
import type React from "react"
import { auth } from "../../lib/auth"

export const Route = createFileRoute("/superadmin")({
  beforeLoad: async () => {
    const { data: session } = await auth.getSession()

    if (!session) {
      throw redirect({
        to: "/login",
      })
    }

    if (session.user.role !== "admin") {
      throw redirect({
        to: "/app",
      })
    }

    return { session }
  },
  component: AdminLayout,
})

type NavItem = {
  title: string
  url: string
  icon?: React.ComponentType
  isActive?: boolean
  items?: { title: string; url: string }[]
}

const navItems: NavItem[] = [
  {
    title: "Organizations",
    url: "/superadmin/organizations",
    icon: Building,
    items: [
      { title: "List Organizations", url: "/superadmin/organizations" },
      { title: "Create Organization", url: "/superadmin/organizations/create" },
    ],
  },
  {
    title: "Users",
    url: "/superadmin/users",
    icon: Users,
    items: [
      { title: "List Users", url: "/superadmin/users" },
      { title: "Create User", url: "/superadmin/users/create" },
    ],
  },
]

function SidebarNavItem({ item }: { item: NavItem }) {
  if (item.items && item.items.length > 0) {
    return (
      <Collapsible
        defaultOpen={item.isActive ?? false}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger render={<SidebarMenuButton />}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    render={
                      <Link
                        to={subItem.url}
                        activeProps={{ "data-active": true }}
                        activeOptions={{
                          exact: true,
                        }}
                      />
                    }
                  >
                    <span>{subItem.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link to={item.url} activeProps={{ "data-active": true }} />}
      >
        {item.icon && <item.icon />}
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function AdminLayout() {
  const { session } = Route.useRouteContext()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await auth.signOut()
    void navigate({ to: "/login" })
  }

  return (
    <SidebarLayout>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarNavItem key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b px-4 transition-[width,height] ease-linear">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>/</BreadcrumbPage>
                <BreadcrumbPage>Super Admin</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md p-1.5">
                <Avatar>
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback seed={session.user.name} />
                </Avatar>
                <div className="hidden text-left md:block">
                  <p className="text-small leading-none font-medium">
                    {session.user.name}
                  </p>
                  <p className="text-muted-foreground max-w-32 truncate text-xs">
                    {session.user.email}
                  </p>
                </div>
                <ChevronDown className="text-muted-foreground size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarLayout>
  )
}
