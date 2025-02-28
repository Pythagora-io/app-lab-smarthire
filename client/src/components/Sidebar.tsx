import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Users,
  Building2,
  Briefcase,
  UserPlus,
  FileText,
  LayoutDashboard,
  Menu,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext"
import { ScrollArea } from "./ui/scroll-area"

const SidebarLink = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => {
  const location = useLocation()
  const isActive = location.pathname === href

  return (
    <NavLink
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </NavLink>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const sidebarContent = (
    <ScrollArea className="h-full py-6">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">SmartHire</h2>
          <div className="space-y-1">
            <SidebarLink href="/" icon={LayoutDashboard}>Dashboard</SidebarLink>
            <SidebarLink href="/applicants" icon={UserPlus}>Applicants</SidebarLink>
            <SidebarLink href="/job-postings" icon={Briefcase}>Job Postings</SidebarLink>
            {user?.role !== 'Hiring Manager' && (
              <>
                <SidebarLink href="/teams" icon={Users}>Teams</SidebarLink>
                <SidebarLink href="/contracts" icon={FileText}>Contracts</SidebarLink>
              </>
            )}
            {user?.role === 'Admin' && (
              <SidebarLink href="/organization" icon={Building2}>Organization</SidebarLink>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  )

  return (
    <>
      <aside className="hidden border-r bg-background/80 backdrop-blur-sm md:block md:w-64">
        {sidebarContent}
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  )
}