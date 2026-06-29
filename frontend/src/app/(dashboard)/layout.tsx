import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full bg-background text-foreground">
      {/* Sidebar */}
      <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50 p-4">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <main className="md:pl-72 w-full h-full flex flex-col p-4 overflow-y-auto">
        <Header />
        <div className="flex-1 w-full glass rounded-xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
