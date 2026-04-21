import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { AmbientOrbs } from "@/components/ambient-orbs"

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="relative flex flex-1 flex-col min-h-svh overflow-hidden">
        <AmbientOrbs />
        <AppHeader />
        <main className="relative flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
