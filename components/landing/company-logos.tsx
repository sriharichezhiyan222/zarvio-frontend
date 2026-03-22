"use client";

import { motion } from "framer-motion";

// Company logos as SVG components for a premium look
const logos = [
  {
    name: "Stripe",
    svg: (
      <svg viewBox="0 0 60 25" className="h-6 w-auto">
        <path
          fill="currentColor"
          d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a12.2 12.2 0 0 1-4.56.83c-4.14 0-6.9-2.42-6.9-7.37 0-4.04 2.33-7.37 6.22-7.37 3.89 0 6.1 3.33 6.1 7.28 0 .7-.06 1.24-.05 1.71zm-6-5.16c-1.15 0-2.01.9-2.17 2.42h4.26c-.09-1.43-.82-2.42-2.1-2.42zm-12.04-3.83c1.67 0 2.93.4 3.78 1.02l-1.24 3.3c-.74-.42-1.66-.72-2.8-.72-1.9 0-2.84 1.17-2.84 3.37v6.84h-4.36V5.7h4.02l.2 1.59c.63-1.24 1.94-1.99 3.24-2zm-9.75 5.44c0-2.64-1.1-3.64-2.8-3.64-.96 0-2.09.47-2.97 1.51V5.7h-4.36v13.4h4.02l.2-1.19c.74.9 1.85 1.59 3.36 1.59 2.76 0 4.95-2.41 4.95-7.28v-1.48zm-4.11 3.32c-.74 0-1.36-.28-1.82-.72v-4.42c.52-.54 1.18-.82 1.82-.82 1.17 0 1.88 1.04 1.88 2.9 0 1.86-.71 3.06-1.88 3.06zm-14.23-2.32c0 2.27-1.67 4.27-5.1 4.27-2.47 0-4.35-.77-5.5-1.71l1.38-3.04c.82.7 2.2 1.42 3.73 1.42 1.15 0 1.51-.37 1.51-.83 0-1.56-6.52-.68-6.52-5.59 0-2.33 1.71-4.17 5.06-4.17 2.06 0 3.75.54 4.86 1.36l-1.38 3.08c-.68-.54-1.8-1.1-3.2-1.1-1.02 0-1.38.4-1.38.76 0 1.56 6.54.64 6.54 5.55z"
        />
      </svg>
    ),
  },
  {
    name: "Notion",
    svg: (
      <svg viewBox="0 0 100 25" className="h-5 w-auto">
        <path
          fill="currentColor"
          d="M14.61 3.02l9.09.7c1.12.1 1.4.15 2.06.65l2.82 2.23c.44.35.56.45.56.81v12.7c0 .78-.28 1.24-1.24 1.32l-10.31.6c-.72.04-1.06-.08-1.44-.54l-2.3-2.98c-.42-.54-.6-.9-.6-1.32V4.34c0-.56.28-1.24 1.36-1.32z"
        />
        <path
          fill="currentColor"
          fillOpacity="0.7"
          d="M22.67 5.44v11.35c0 .62-.24.91-.76.95l-8.5.49V5.87l.2-.04 7.98-.52c.76-.04 1.08.2 1.08.13z"
        />
        <text x="32" y="18" fontSize="14" fontWeight="500" fill="currentColor">
          notion
        </text>
      </svg>
    ),
  },
  {
    name: "Vercel",
    svg: (
      <svg viewBox="0 0 76 20" className="h-5 w-auto">
        <path fill="currentColor" d="M26.4 5.33 20.33 17h12.14z" />
        <text x="38" y="15" fontSize="12" fontWeight="500" fill="currentColor">
          Vercel
        </text>
      </svg>
    ),
  },
  {
    name: "Linear",
    svg: (
      <svg viewBox="0 0 80 20" className="h-5 w-auto">
        <circle cx="10" cy="10" r="8" fill="currentColor" />
        <path d="M6 10h8M10 6v8" stroke="currentColor" strokeWidth="1.5" fill="none" className="stroke-background" />
        <text x="24" y="15" fontSize="12" fontWeight="500" fill="currentColor">
          Linear
        </text>
      </svg>
    ),
  },
  {
    name: "Figma",
    svg: (
      <svg viewBox="0 0 70 20" className="h-5 w-auto">
        <circle cx="7" cy="5" r="4" fill="currentColor" fillOpacity="0.4" />
        <circle cx="15" cy="5" r="4" fill="currentColor" fillOpacity="0.6" />
        <circle cx="7" cy="13" r="4" fill="currentColor" fillOpacity="0.8" />
        <circle cx="15" cy="13" r="4" fill="currentColor" />
        <text x="26" y="15" fontSize="12" fontWeight="500" fill="currentColor">
          Figma
        </text>
      </svg>
    ),
  },
  {
    name: "Slack",
    svg: (
      <svg viewBox="0 0 70 20" className="h-5 w-auto">
        <rect x="2" y="7" width="4" height="10" rx="2" fill="currentColor" fillOpacity="0.6" />
        <rect x="8" y="3" width="4" height="14" rx="2" fill="currentColor" fillOpacity="0.8" />
        <rect x="14" y="5" width="4" height="12" rx="2" fill="currentColor" />
        <rect x="20" y="9" width="4" height="8" rx="2" fill="currentColor" fillOpacity="0.7" />
        <text x="30" y="15" fontSize="12" fontWeight="500" fill="currentColor">
          Slack
        </text>
      </svg>
    ),
  },
  {
    name: "HubSpot",
    svg: (
      <svg viewBox="0 0 90 20" className="h-5 w-auto">
        <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="10" cy="10" r="3" fill="currentColor" />
        <text x="24" y="15" fontSize="12" fontWeight="500" fill="currentColor">
          HubSpot
        </text>
      </svg>
    ),
  },
  {
    name: "Salesforce",
    svg: (
      <svg viewBox="0 0 100 20" className="h-5 w-auto">
        <ellipse cx="10" cy="12" rx="8" ry="6" fill="currentColor" fillOpacity="0.3" />
        <ellipse cx="18" cy="10" rx="7" ry="5" fill="currentColor" fillOpacity="0.5" />
        <ellipse cx="14" cy="8" rx="6" ry="4" fill="currentColor" fillOpacity="0.7" />
        <text x="30" y="15" fontSize="11" fontWeight="500" fill="currentColor">
          salesforce
        </text>
      </svg>
    ),
  },
];

export function CompanyLogos() {
  return (
    <div className="relative overflow-hidden py-8">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      
      <motion.div 
        className="flex gap-16 items-center"
        animate={{ x: [0, -1200] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <div 
            key={`${logo.name}-${index}`}
            className="flex items-center gap-3 text-muted-foreground/60 hover:text-muted-foreground transition-colors shrink-0"
          >
            {logo.svg}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function CompanyLogosStatic() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
      {logos.slice(0, 6).map((logo, index) => (
        <motion.div
          key={logo.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          {logo.svg}
        </motion.div>
      ))}
    </div>
  );
}
