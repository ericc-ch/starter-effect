import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/avatar"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarLayout,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/sidebar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/input-group"
import { InputPassword } from "@/components/input-password"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet"
import { Skeleton } from "@/components/skeleton"
import { Textarea } from "@/components/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip"
import { Button } from "@/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/field"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { LanguageToggle } from "@/components/language-toggle"
import { Separator } from "@/components/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { createFileRoute } from "@tanstack/react-router"
import {
  AtSign,
  Bell,
  ChevronDown,
  ChevronsUpDown,
  Copy,
  CreditCard,
  DollarSign,
  FileText,
  HelpCircle,
  Home,
  Image,
  Inbox,
  Info,
  Keyboard,
  LayoutGrid,
  Link2,
  List,
  Lock,
  LogOut,
  Mail,
  MoreHorizontal,
  PanelBottom,
  PanelLeft,
  PanelRight,
  PanelTop,
  Plus,
  Search,
  Send,
  Settings,
  Share,
  SortAsc,
  SortDesc,
  Trash2,
  User,
  Video,
  X,
  Archive,
  ChevronRight,
  Folder,
} from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/theme")({
  component: ThemeShowcase,
})

function ThemeShowcase() {
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Theme Showcase</h1>
          <div className="flex gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl space-y-16 px-4 py-10">
        {/* Interactive */}
        <ButtonsSection />
        <DropdownMenuSection />
        <TooltipsSection />

        {/* Layout & Navigation */}
        <CardsSection />
        <SheetSection />
        <SidebarSection />
        <CollapsibleSection />
        <BreadcrumbsSection />
        <SeparatorsSection />

        {/* Form Components */}
        <FormsSection />
        <TextareaSection />
        <InputGroupSection />
        <InputPasswordSection />

        {/* Data Display */}
        <AvatarsSection />
        <SkeletonSection />

        {/* Theme */}
        <ColorPaletteSection />
      </main>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Buttons Section
// -----------------------------------------------------------------------------

function ButtonsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Buttons</h2>
        <code className="text-muted-foreground text-sm">
          @/components/button
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Variants</CardTitle>
          <CardDescription>
            All available button variants for different contexts
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sizes</CardTitle>
          <CardDescription>
            Different button sizes for various use cases
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button size="lg">Large</Button>
          <Button size="default">Default</Button>
          <Button size="sm">Small</Button>
          <Button size="icon-lg">
            <Plus />
          </Button>
          <Button size="icon">
            <Plus />
          </Button>
          <Button size="icon-sm">
            <Plus />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>With Icons</CardTitle>
          <CardDescription>
            Buttons with leading or trailing icons
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>
            <Mail />
            Login with Email
          </Button>
          <Button variant="secondary">
            <Plus />
            Create New
          </Button>
          <Button variant="outline">
            Share
            <Share />
          </Button>
          <Button variant="destructive">
            <Trash2 />
            Delete
          </Button>
          <Button variant="ghost">
            <Copy />
            Copy
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Disabled State</CardTitle>
          <CardDescription>Buttons in their disabled state</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button disabled>Default</Button>
          <Button variant="secondary" disabled>
            Secondary
          </Button>
          <Button variant="destructive" disabled>
            Destructive
          </Button>
          <Button variant="outline" disabled>
            Outline
          </Button>
          <Button variant="ghost" disabled>
            Ghost
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Cards Section
// -----------------------------------------------------------------------------

function CardsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Cards</h2>
        <code className="text-muted-foreground text-sm">@/components/card</code>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
            <CardAction>
              <Button variant="outline" size="sm">
                <Settings className="size-4" />
                Edit
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                <User className="text-muted-foreground size-8" />
              </div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-muted-foreground text-sm">
                  john@example.com
                </p>
              </div>
            </div>
            <Separator />
            <div className="text-sm">
              <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                Admin
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have 3 unread messages</CardDescription>
            <CardAction>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="size-4" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Bell className="text-muted-foreground mt-0.5 size-4" />
              <div>
                <p className="text-sm font-medium">New comment on your post</p>
                <p className="text-muted-foreground text-xs">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="text-muted-foreground mt-0.5 size-4" />
              <div>
                <p className="text-sm font-medium">New follower: Jane Smith</p>
                <p className="text-muted-foreground text-xs">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="text-muted-foreground mt-0.5 size-4" />
              <div>
                <p className="text-sm font-medium">Payment received</p>
                <p className="text-muted-foreground text-xs">Yesterday</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t">
            <Button variant="ghost" size="sm" className="w-full">
              View all notifications
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Statistics</CardTitle>
          <CardDescription>
            Your performance metrics for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">$12,450</p>
              <p className="text-xs text-green-600">+12.5% from last month</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Orders</p>
              <p className="text-2xl font-bold">356</p>
              <p className="text-xs text-green-600">+8.2% from last month</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Customers</p>
              <p className="text-2xl font-bold">2,103</p>
              <p className="text-xs text-green-600">+18.7% from last month</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Refunds</p>
              <p className="text-2xl font-bold">12</p>
              <p className="text-destructive text-xs">+2.1% from last month</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Sheet Section
// -----------------------------------------------------------------------------

function SheetSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Sheet</h2>
        <code className="text-muted-foreground text-sm">
          @/components/sheet
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sides</CardTitle>
          <CardDescription>
            Sheets that slide in from different edges of the screen
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              <PanelRight />
              Open Right
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Right Sheet</SheetTitle>
                <SheetDescription>
                  This sheet slides in from the right edge.
                </SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <p className="text-muted-foreground text-sm">
                  Sheet content goes here. You can add forms, lists, or any
                  other content.
                </p>
              </div>
              <SheetFooter>
                <SheetClose render={<Button variant="outline" />}>
                  Close
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              <PanelLeft />
              Open Left
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Left Sheet</SheetTitle>
                <SheetDescription>
                  This sheet slides in from the left edge.
                </SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <p className="text-muted-foreground text-sm">
                  Perfect for navigation menus or sidebars.
                </p>
              </div>
              <SheetFooter>
                <SheetClose render={<Button variant="outline" />}>
                  Close
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              <PanelTop />
              Open Top
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>Top Sheet</SheetTitle>
                <SheetDescription>
                  This sheet slides in from the top edge.
                </SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <p className="text-muted-foreground text-sm">
                  Great for notifications or quick actions.
                </p>
              </div>
              <SheetFooter>
                <SheetClose render={<Button variant="outline" />}>
                  Close
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              <PanelBottom />
              Open Bottom
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Bottom Sheet</SheetTitle>
                <SheetDescription>
                  This sheet slides in from the bottom edge.
                </SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <p className="text-muted-foreground text-sm">
                  Ideal for mobile-style action sheets.
                </p>
              </div>
              <SheetFooter>
                <SheetClose render={<Button variant="outline" />}>
                  Close
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Sidebar Section
// -----------------------------------------------------------------------------

function SidebarSection() {
  const [showPreview, setShowPreview] = useState(false)
  const [side, setSide] = useState<"left" | "right">("left")
  const [variant, setVariant] = useState<"sidebar" | "floating" | "inset">(
    "sidebar",
  )

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Sidebar</h2>
        <code className="text-muted-foreground text-sm">
          @/components/sidebar
        </code>
      </div>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Sidebar Combinations</CardTitle>
          <CardDescription>
            Select side and variant, then preview the sidebar layout
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Side selector */}
          <Field orientation="horizontal">
            <FieldLabel className="min-w-20">Side</FieldLabel>
            <div className="flex gap-2">
              <Button
                variant={side === "left" ? "default" : "outline"}
                size="sm"
                onClick={() => setSide("left")}
              >
                <PanelLeft /> Left
              </Button>
              <Button
                variant={side === "right" ? "default" : "outline"}
                size="sm"
                onClick={() => setSide("right")}
              >
                <PanelRight /> Right
              </Button>
            </div>
          </Field>

          {/* Variant selector */}
          <Field orientation="horizontal">
            <FieldLabel className="min-w-20">Variant</FieldLabel>
            <div className="flex gap-2">
              {(["sidebar", "floating", "inset"] as const).map((v) => (
                <Button
                  key={v}
                  variant={variant === v ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVariant(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>
          </Field>
        </CardContent>
        <CardFooter className="flex justify-between border-t">
          <p className="text-muted-foreground text-sm">
            Current: <code>{side}</code> + <code>{variant}</code>
          </p>
          <Button onClick={() => setShowPreview(true)}>Open Preview</Button>
        </CardFooter>
      </Card>

      {/* Components Reference Card */}
      <Card>
        <CardHeader>
          <CardTitle>Available Components</CardTitle>
          <CardDescription>
            All exported components from @/components/sidebar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
            {[
              "SidebarLayout",
              "Sidebar",
              "SidebarInset",
              "SidebarHeader",
              "SidebarContent",
              "SidebarFooter",
              "SidebarSeparator",
              "SidebarInput",
              "SidebarGroup",
              "SidebarGroupLabel",
              "SidebarGroupAction",
              "SidebarGroupContent",
              "SidebarMenu",
              "SidebarMenuItem",
              "SidebarMenuButton",
              "SidebarMenuAction",
              "SidebarMenuBadge",
              "SidebarMenuSkeleton",
              "SidebarMenuSub",
              "SidebarMenuSubItem",
              "SidebarMenuSubButton",
              "SidebarTrigger",
            ].map((name) => (
              <code key={name} className="bg-muted rounded px-1.5 py-0.5">
                {name}
              </code>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full-screen Preview Overlay */}
      {showPreview && (
        <div className="bg-background fixed inset-0 z-50">
          <SidebarLayout>
            {side === "left" && (
              <PreviewSidebar side={side} variant={variant} />
            )}

            <SidebarInset>
              <header className="flex h-14 items-center gap-2 border-b px-4">
                <h2 className="font-semibold">Sidebar Preview</h2>
                <p className="text-muted-foreground text-sm">
                  side=&quot;{side}&quot; variant=&quot;{variant}&quot;
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setShowPreview(false)}
                >
                  <X /> Close Preview
                </Button>
              </header>
              <div className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preview Content</CardTitle>
                    <CardDescription>
                      This preview demonstrates all sidebar components with your
                      selected configuration.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Components demonstrated:
                      </h4>
                      <ul className="text-muted-foreground list-inside list-disc text-sm">
                        <li>SidebarHeader with SidebarInput</li>
                        <li>SidebarContent with scrollable area</li>
                        <li>SidebarGroup with label and action button</li>
                        <li>SidebarMenu with various item types</li>
                        <li>Active menu item (Inbox)</li>
                        <li>Menu item with badge (Sent - 24)</li>
                        <li>Menu item with hover action (Archive)</li>
                        <li>Collapsible submenu (Projects)</li>
                        <li>SidebarSeparator</li>
                        <li>SidebarMenuSkeleton loading states</li>
                        <li>SidebarFooter with user profile</li>
                      </ul>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Current settings:</h4>
                      <div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Side: <code className="bg-muted px-1">{side}</code>
                        </div>
                        <div>
                          Variant:{" "}
                          <code className="bg-muted px-1">{variant}</code>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </SidebarInset>

            {side === "right" && (
              <PreviewSidebar side={side} variant={variant} />
            )}
          </SidebarLayout>
        </div>
      )}
    </section>
  )
}

function PreviewSidebar({
  side,
  variant,
}: {
  side: "left" | "right"
  variant: "sidebar" | "floating" | "inset"
}) {
  return (
    <Sidebar side={side} variant={variant}>
      <SidebarHeader>
        <SidebarInput placeholder="Search..." />
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Active item */}
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Inbox /> Inbox
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Item with badge */}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Send /> Sent
                </SidebarMenuButton>
                <SidebarMenuBadge>24</SidebarMenuBadge>
              </SidebarMenuItem>

              {/* Item with action */}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Archive /> Archive
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </SidebarMenuItem>

              {/* Collapsible submenu */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger render={<SidebarMenuButton />}>
                    <Folder /> Projects
                    <ChevronRight className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Design</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive>
                          Development
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Marketing</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Loading skeleton demo */}
        <SidebarGroup>
          <SidebarGroupLabel>Loading State</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <User /> John Doe
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// -----------------------------------------------------------------------------
// Forms Section
// -----------------------------------------------------------------------------

function FormsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Forms</h2>
        <code className="text-muted-foreground text-sm">
          @/components/input, @/components/label, @/components/field
        </code>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Login Form</CardTitle>
            <CardDescription>
              Using Field components with vertical layout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                <FieldContent>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="john@example.com"
                  />
                  <FieldDescription>
                    We&apos;ll never share your email
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <FieldContent>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </FieldContent>
              </Field>
              <Button className="w-full">
                <Mail />
                Sign In
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input States</CardTitle>
            <CardDescription>
              Different input states and variations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="normal-input">Normal</FieldLabel>
                <Input id="normal-input" placeholder="Normal input" />
              </Field>
              <Field>
                <FieldLabel htmlFor="disabled-input">Disabled</FieldLabel>
                <Input
                  id="disabled-input"
                  placeholder="Disabled input"
                  disabled
                />
              </Field>
              <Field data-invalid="true">
                <FieldLabel htmlFor="invalid-input">Invalid</FieldLabel>
                <FieldContent>
                  <Input
                    id="invalid-input"
                    placeholder="Invalid input"
                    aria-invalid="true"
                    defaultValue="invalid@"
                  />
                  <FieldError>Please enter a valid email address</FieldError>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="file-input">File</FieldLabel>
                <Input id="file-input" type="file" />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings Form</CardTitle>
          <CardDescription>
            Horizontal and responsive field layouts with validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldGroup>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="display-name" className="min-w-32">
                  Display Name
                </FieldLabel>
                <FieldContent>
                  <Input id="display-name" defaultValue="John Doe" />
                  <FieldDescription>
                    This is your public display name
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="username" className="min-w-32">
                  Username
                </FieldLabel>
                <FieldContent>
                  <Input id="username" defaultValue="johndoe" />
                </FieldContent>
              </Field>
              <Field orientation="horizontal" data-invalid="true">
                <FieldLabel htmlFor="website" className="min-w-32">
                  Website
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="website"
                    defaultValue="not-a-valid-url"
                    aria-invalid="true"
                  />
                  <FieldError>Please enter a valid URL</FieldError>
                </FieldContent>
              </Field>
              <FieldSeparator>Account Security</FieldSeparator>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="current-password" className="min-w-32">
                  Current Password
                </FieldLabel>
                <Input id="current-password" type="password" />
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="new-password" className="min-w-32">
                  New Password
                </FieldLabel>
                <FieldContent>
                  <Input id="new-password" type="password" />
                  <FieldDescription>
                    Must be at least 8 characters
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Standalone Labels</CardTitle>
          <CardDescription>Label component used directly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="standalone">Normal Label</Label>
            <Input id="standalone" className="max-w-xs" />
          </div>
          <div className="flex items-center gap-4" data-disabled="true">
            <Label htmlFor="disabled-label">Disabled Label</Label>
            <Input id="disabled-label" className="max-w-xs" disabled />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Textarea Section
// -----------------------------------------------------------------------------

function TextareaSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Textarea</h2>
        <code className="text-muted-foreground text-sm">
          @/components/textarea
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>States</CardTitle>
          <CardDescription>
            Different textarea states and variations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="textarea-normal">Normal</FieldLabel>
              <FieldContent>
                <Textarea
                  id="textarea-normal"
                  placeholder="Enter your message..."
                />
                <FieldDescription>
                  A standard textarea for multi-line input
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="textarea-disabled">Disabled</FieldLabel>
              <FieldContent>
                <Textarea
                  id="textarea-disabled"
                  placeholder="This textarea is disabled"
                  disabled
                />
              </FieldContent>
            </Field>
            <Field data-invalid="true">
              <FieldLabel htmlFor="textarea-invalid">Invalid</FieldLabel>
              <FieldContent>
                <Textarea
                  id="textarea-invalid"
                  placeholder="Invalid textarea"
                  aria-invalid="true"
                  defaultValue="This content is too short"
                />
                <FieldError>Message must be at least 50 characters</FieldError>
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Input Group Section
// -----------------------------------------------------------------------------

function InputGroupSection() {
  const [charCount, setCharCount] = useState(0)
  const maxChars = 200

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Input Groups</h2>
        <code className="text-muted-foreground text-sm">
          @/components/input-group
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>With Icons</CardTitle>
          <CardDescription>
            Input groups with leading icons for visual context
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search..." />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <AtSign />
            </InputGroupAddon>
            <InputGroupInput type="email" placeholder="Email address" />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Link2 />
            </InputGroupAddon>
            <InputGroupInput type="url" placeholder="https://example.com" />
          </InputGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>With Buttons</CardTitle>
          <CardDescription>
            Input groups with action buttons for copy or clear
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputGroup>
            <InputGroupInput defaultValue="https://verion.dev/share/abc123" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton>
                <Copy />
                Copy
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput
              placeholder="Search..."
              defaultValue="Query text"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs">
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>With Text</CardTitle>
          <CardDescription>
            Input groups with prefix or suffix text labels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <DollarSign />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput type="number" placeholder="0.00" />
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="yoursite" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>.com</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="example.com" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>/path</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>With Keyboard Shortcut</CardTitle>
          <CardDescription>
            Input groups displaying keyboard shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search commands..." />
            <InputGroupAddon align="inline-end">
              <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium">
                <span className="text-xs">⌘</span>K
              </kbd>
            </InputGroupAddon>
          </InputGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Block Aligned</CardTitle>
          <CardDescription>
            Textarea with character counter in block-end addon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InputGroup>
            <InputGroupTextarea
              placeholder="Write your message..."
              rows={4}
              maxLength={maxChars}
              onChange={(e) => setCharCount(e.target.value.length)}
            />
            <InputGroupAddon align="block-end" className="justify-end">
              <InputGroupText>
                <span
                  className={
                    charCount > maxChars * 0.9 ? "text-destructive" : ""
                  }
                >
                  {charCount}/{maxChars}
                </span>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </CardContent>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Password Input Section
// -----------------------------------------------------------------------------

function InputPasswordSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Password Input
        </h2>
        <code className="text-muted-foreground text-sm">
          @/components/input-password
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Password Toggle</CardTitle>
          <CardDescription>
            Password input with visibility toggle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel htmlFor="password-demo">Password</FieldLabel>
            <FieldContent>
              <InputPassword
                id="password-demo"
                placeholder="Enter your password"
              />
              <FieldDescription>
                Click the eye icon to toggle visibility
              </FieldDescription>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Dropdown Menu Section
// -----------------------------------------------------------------------------

function DropdownMenuSection() {
  const [showStatusBar, setShowStatusBar] = useState(true)
  const [showPanel, setShowPanel] = useState(false)
  const [sortOrder, setSortOrder] = useState("asc")

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dropdown Menu</h2>
        <code className="text-muted-foreground text-sm">
          @/components/dropdown-menu
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Examples</CardTitle>
          <CardDescription>
            Various dropdown menu configurations and item types
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <User />
              User Menu
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User />
                  Profile
                  <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                  <DropdownMenuShortcut>Ctrl+B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Settings
                  <DropdownMenuShortcut>Ctrl+,</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Keyboard />
                  Keyboard shortcuts
                  <DropdownMenuShortcut>Ctrl+K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut />
                Log out
                <DropdownMenuShortcut>Ctrl+Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Checkbox Items */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <LayoutGrid />
              View Options
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
              >
                Show Status Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showPanel}
                onCheckedChange={setShowPanel}
              >
                Show Activity Panel
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem disabled>
                Show Console (Disabled)
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Radio Items */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              {sortOrder === "asc" ?
                <SortAsc />
              : <SortDesc />}
              Sort Order
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Sort Direction</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={sortOrder}
                onValueChange={setSortOrder}
              >
                <DropdownMenuRadioItem value="asc">
                  <SortAsc />
                  Ascending
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">
                  <SortDesc />
                  Descending
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Submenu */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <Plus />
              New Item
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <FileText />
                  New Document
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Plus />
                    More Options
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <Image />
                      New Image
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Video />
                      New Video
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <List />
                      New List
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Copy />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Separators Section
// -----------------------------------------------------------------------------

function SeparatorsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Separators</h2>
        <code className="text-muted-foreground text-sm">
          @/components/separator
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Horizontal Separator</CardTitle>
          <CardDescription>Default horizontal orientation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm">Content above the separator</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm">Content below the separator</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vertical Separator</CardTitle>
          <CardDescription>Used between inline elements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-5 items-center gap-4 text-sm">
            <span>Home</span>
            <Separator orientation="vertical" />
            <span>Products</span>
            <Separator orientation="vertical" />
            <span>About</span>
            <Separator orientation="vertical" />
            <span>Contact</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Field Separator with Text</CardTitle>
          <CardDescription>Separator with centered label text</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="sep-email">Email</FieldLabel>
              <Input
                id="sep-email"
                type="email"
                placeholder="john@example.com"
              />
            </Field>
            <FieldSeparator>or continue with</FieldSeparator>
            <Button variant="outline" className="w-full">
              <Lock />
              Single Sign-On
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Color Palette Section
// -----------------------------------------------------------------------------

function ColorPaletteSection() {
  const coreColors = [
    { name: "background", variable: "bg-background", border: true },
    { name: "foreground", variable: "bg-foreground" },
    { name: "primary", variable: "bg-primary" },
    {
      name: "primary-foreground",
      variable: "bg-primary-foreground",
      border: true,
    },
    { name: "secondary", variable: "bg-secondary", border: true },
    { name: "secondary-foreground", variable: "bg-secondary-foreground" },
  ]

  const uiColors = [
    { name: "muted", variable: "bg-muted", border: true },
    { name: "muted-foreground", variable: "bg-muted-foreground" },
    { name: "accent", variable: "bg-accent", border: true },
    { name: "accent-foreground", variable: "bg-accent-foreground" },
    { name: "destructive", variable: "bg-destructive" },
    { name: "border", variable: "bg-border" },
    { name: "input", variable: "bg-input" },
    { name: "ring", variable: "bg-ring" },
  ]

  const surfaceColors = [
    { name: "card", variable: "bg-card", border: true },
    { name: "card-foreground", variable: "bg-card-foreground" },
    { name: "popover", variable: "bg-popover", border: true },
    { name: "popover-foreground", variable: "bg-popover-foreground" },
  ]

  const chartColors = [
    { name: "chart-1", variable: "bg-chart-1" },
    { name: "chart-2", variable: "bg-chart-2" },
    { name: "chart-3", variable: "bg-chart-3" },
    { name: "chart-4", variable: "bg-chart-4" },
    { name: "chart-5", variable: "bg-chart-5" },
  ]

  const sidebarColors = [
    { name: "sidebar", variable: "bg-sidebar", border: true },
    { name: "sidebar-foreground", variable: "bg-sidebar-foreground" },
    { name: "sidebar-primary", variable: "bg-sidebar-primary" },
    {
      name: "sidebar-primary-foreground",
      variable: "bg-sidebar-primary-foreground",
      border: true,
    },
    { name: "sidebar-accent", variable: "bg-sidebar-accent", border: true },
    {
      name: "sidebar-accent-foreground",
      variable: "bg-sidebar-accent-foreground",
    },
    { name: "sidebar-border", variable: "bg-sidebar-border" },
    { name: "sidebar-ring", variable: "bg-sidebar-ring" },
  ]

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Color Palette</h2>
        <code className="text-muted-foreground text-sm">
          CSS variables from @/index.css
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Core Colors</CardTitle>
          <CardDescription>Primary theme colors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {coreColors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>UI Colors</CardTitle>
          <CardDescription>Colors for UI elements and states</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {uiColors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Surface Colors</CardTitle>
          <CardDescription>Colors for cards and popovers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {surfaceColors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chart Colors</CardTitle>
          <CardDescription>Colors for data visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {chartColors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sidebar Colors</CardTitle>
          <CardDescription>Colors for sidebar components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {sidebarColors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function ColorSwatch({
  name,
  variable,
  border = false,
}: {
  name: string
  variable: string
  border?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <div
        className={`h-12 rounded-md ${variable} ${border ? "border" : ""}`}
      />
      <p className="text-xs font-medium">{name}</p>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Avatars Section
// -----------------------------------------------------------------------------

function AvatarsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Avatars</h2>
        <code className="text-muted-foreground text-sm">
          @/components/avatar
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sizes</CardTitle>
          <CardDescription>
            Avatars in small, default, and large sizes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar size="sm">
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>DF</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>With Images & Fallback</CardTitle>
          <CardDescription>
            Avatars with images and generated fallbacks using DiceBear
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback seed="john-doe" />
          </Avatar>
          <Avatar>
            <AvatarFallback seed="jane-smith" />
          </Avatar>
          <Avatar>
            <AvatarFallback seed="bob-wilson" />
          </Avatar>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>
            Avatars with online indicators and notification badges
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback seed="alice" />
            <AvatarBadge className="bg-green-500" />
          </Avatar>
          <Avatar>
            <AvatarFallback seed="charlie" />
            <AvatarBadge className="bg-yellow-500" />
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback seed="david" />
            <AvatarBadge className="size-4 bg-red-500 text-[10px] font-medium text-white">
              3
            </AvatarBadge>
          </Avatar>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avatar Groups</CardTitle>
          <CardDescription>Stacked avatars with overflow count</CardDescription>
        </CardHeader>
        <CardContent>
          <AvatarGroup>
            <Avatar>
              <AvatarFallback seed="user-1" />
            </Avatar>
            <Avatar>
              <AvatarFallback seed="user-2" />
            </Avatar>
            <Avatar>
              <AvatarFallback seed="user-3" />
            </Avatar>
            <Avatar>
              <AvatarFallback seed="user-4" />
            </Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        </CardContent>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Skeleton Section
// -----------------------------------------------------------------------------

function SkeletonSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Skeleton</h2>
        <code className="text-muted-foreground text-sm">
          @/components/skeleton
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Text Lines</CardTitle>
          <CardDescription>
            Skeleton placeholders for text content with varying widths
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>
            Circular skeleton for avatar placeholders
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="size-14 rounded-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Card Skeleton</CardTitle>
          <CardDescription>
            Complete card placeholder with image, title, and description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 rounded-lg border p-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Tooltips Section
// -----------------------------------------------------------------------------

function TooltipsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Tooltips</h2>
        <code className="text-muted-foreground text-sm">
          @/components/tooltip
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Positions</CardTitle>
          <CardDescription>
            Tooltips positioned on different sides of the trigger
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Top
            </TooltipTrigger>
            <TooltipContent side="top">Tooltip on top</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Right
            </TooltipTrigger>
            <TooltipContent side="right">Tooltip on right</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Bottom
            </TooltipTrigger>
            <TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Left
            </TooltipTrigger>
            <TooltipContent side="left">Tooltip on left</TooltipContent>
          </Tooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>On Icons</CardTitle>
          <CardDescription>
            Icon buttons with tooltips explaining their action
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
              <HelpCircle />
            </TooltipTrigger>
            <TooltipContent>Get help</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
              <Info />
            </TooltipTrigger>
            <TooltipContent>More information</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
              <Settings />
            </TooltipTrigger>
            <TooltipContent>Open settings</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
              <Share />
            </TooltipTrigger>
            <TooltipContent>Share this item</TooltipContent>
          </Tooltip>
        </CardContent>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Breadcrumbs Section
// -----------------------------------------------------------------------------

function BreadcrumbsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Breadcrumbs</h2>
        <code className="text-muted-foreground text-sm">
          @/components/breadcrumb
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Simple Breadcrumb</CardTitle>
          <CardDescription>
            Basic navigation breadcrumb with links and current page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  <Home className="size-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Category</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Item</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>With Ellipsis</CardTitle>
          <CardDescription>
            Breadcrumb with ellipsis for long navigation paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  <Home className="size-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Parent</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Current Page</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardContent>
      </Card>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Collapsible Section
// -----------------------------------------------------------------------------

function CollapsibleSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Collapsible</h2>
        <code className="text-muted-foreground text-sm">
          @/components/collapsible
        </code>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toggle Content</CardTitle>
          <CardDescription>
            Expandable content area with animated transitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Collapsible className="space-y-3">
            <CollapsibleTrigger
              render={
                <Button variant="outline" className="w-full justify-between" />
              }
            >
              Toggle Content
              <ChevronsUpDown className="size-4" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground text-sm">
                  This content can be expanded or collapsed. Collapsible
                  components are useful for FAQs, accordions, and any content
                  that should be hidden by default but accessible on demand.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </section>
  )
}
