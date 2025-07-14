"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") {
      return; // Do nothing while loading
    }

    // If no session exists and we require auth, redirect to signin
    if (!session && requireAuth) {
      router.push(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
    }

    // If session exists and we're on auth pages, redirect to dashboard
    if (session && (pathname === "/signin" || pathname === "/signup")) {
      router.push("/");
    }
  }, [session, status, requireAuth, router, pathname]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If we have the correct auth state, render the children
  if ((requireAuth && session) || (!requireAuth && !session) || (!requireAuth)) {
    return <>{children}</>;
  }

  // This is just for server-side rendering to avoid flickering
  return null;
}
