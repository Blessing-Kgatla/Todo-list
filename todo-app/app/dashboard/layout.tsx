import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F7F8FA]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
        </main>
    </div>
  );
}