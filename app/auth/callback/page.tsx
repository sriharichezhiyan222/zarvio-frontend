"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // 2-second delay to settle clock skew
      await new Promise(r => setTimeout(r, 2000));
      
      const hash = window.location.hash;
      if (!hash) {
          // Check for error in query params
          const query = new URLSearchParams(window.location.search);
          const errorMsg = query.get("error_description") || query.get("error");
          if (errorMsg) {
              console.error("Auth callback query error:", errorMsg);
              router.push("/auth/signin?error=" + encodeURIComponent(errorMsg));
              return;
          }
      }

      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.error("Auth callback session error:", error.message);
          router.push("/auth/signin?error=" + encodeURIComponent(error.message));
        } else if (data?.session) {
          router.push("/dashboard");
        }
      } else {
        // Try getSession in case it recovered or was handled otherwise
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          router.push("/dashboard");
        } else {
          console.warn("No token found in callback URL");
          router.push("/auth/signin");
        }
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
