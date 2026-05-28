"use client";

import Sidebar from "@/components/admin/sidebar";
import Topbar from "@/components/admin/topbar";
import { Providers } from "@/components/providers";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <Providers>
      {isLoginPage ? (
        children
      ) : (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
          <Sidebar />
          <div className="flex flex-col md:ml-64">
            <Topbar />
            <main className="flex-1 p-3 md:p-6">{children}</main>
          </div>
        </div>
      )}
    </Providers>
  );
}
