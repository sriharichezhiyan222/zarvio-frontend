"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-chart-2/10 to-background" />
        
        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-chart-2/30 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-chart-2">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-foreground">ZarvioAI</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
              AI Revenue Team for Every Business
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Automate your outreach, research leads at scale, and close more deals with AI-powered sales intelligence.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">2,000+</span> teams already using ZarvioAI
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
