"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Small delay to handle potential clock skew
      await new Promise(r => setTimeout(r, 500));
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error.message);
        router.push("/auth/signin?error=" + encodeURIComponent(error.message));
      } else if (data?.session) {
        // Success! Securely route to dashboard
        router.push("/dashboard");
      } else {
        // No session found yet, maybe it's still processing or was cancelled
        // Fallback to signin if we've waited too long
        console.warn("No session found in callback");
        const timer = setTimeout(() => router.push("/auth/signin"), 3000);
        return () => clearTimeout(timer);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground animate-pulse">Completing sign in...</p>
      </div>
    </div>
  );
}
