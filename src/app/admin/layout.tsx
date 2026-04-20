"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronLeft,
  Award,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
  { name: "Proyek", href: "/admin/projects", icon: <Briefcase size={20} /> },
  { name: "Sertifikat", href: "/admin/certificates", icon: <Award size={20} /> },
  { name: "Komentar", href: "/admin/comments", icon: <MessageSquare size={20} /> },
  { name: "Pesan Masuk", href: "/admin/contacts", icon: <Mail size={20} /> },
  { name: "Pengaturan", href: "/admin/settings", icon: <Settings size={20} /> },
];

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/login");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#00141d]">
        <div className="w-10 h-10 border-4 border-bright-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#00141d]">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#002a3a] border-r border-gray-200 dark:border-white/10 hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold text-deep-blue dark:text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-bright-blue rounded-lg flex items-center justify-center text-white text-xs">A</span>
            Admin Panel
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-deep-blue text-white shadow-lg shadow-deep-blue/20" 
                    : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5 hover:text-deep-blue dark:hover:text-white"
                )}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white dark:bg-[#002a3a] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="md:hidden">
               <ChevronLeft size={24} />
            </Link>
            <h1 className="text-lg font-bold text-deep-blue dark:text-white">
              {menuItems.find(i => i.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-bright-blue/20 text-bright-blue flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
