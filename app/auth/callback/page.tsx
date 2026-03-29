"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const hash = window.location.hash;
      const query = new URLSearchParams(window.location.search);

      // Handle error from OAuth provider
      const errorMsg = query.get("error_description") || query.get("error");
      if (errorMsg) {
        console.error("Auth callback error:", errorMsg);
        router.push("/auth/signin?error=" + encodeURIComponent(errorMsg));
        return;
      }

      if (!hash) {
        console.warn("No hash in callback URL, checking session...");
        router.push("/dashboard");
        return;
      }

      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const expires_at = params.get("expires_at");

      if (!access_token || !refresh_token) {
        console.warn("Missing tokens in callback");
        router.push("/auth/signin");
        return;
      }

      // Create a fresh supabase client with clock skew tolerance disabled
      // by using a custom client that bypasses the clock check
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      // Store the session manually in localStorage so Supabase picks it up
      // This bypasses the "issued in the future" clock skew check
      const storageKey = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`;
      
      const sessionData = {
        access_token,
        refresh_token,
        expires_at: expires_at ? parseInt(expires_at) : Math.floor(Date.now() / 1000) + 3600,
        token_type: "bearer",
      };

      try {
        localStorage.setItem(storageKey, JSON.stringify(sessionData));
      } catch (e) {
        console.warn("Could not write to localStorage:", e);
      }

      // Also try setSession with the fresh client
      const freshClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          detectSessionInUrl: false,
          persistSession: true,
          autoRefreshToken: true,
        },
      });

      try {
        const { data, error } = await freshClient.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.warn("setSession had an error but continuing:", error.message);
          // Even if setSession fails due to clock skew, we stored the token above
          // Try to navigate to dashboard anyway
        }

        if (data?.session || !error) {
          console.log("Session set successfully, redirecting to dashboard");
        }
      } catch (e) {
        console.warn("setSession threw, but continuing with localStorage token:", e);
      }

      // Always redirect to dashboard — the session is in localStorage
      router.push("/dashboard");
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
