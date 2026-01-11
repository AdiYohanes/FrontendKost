"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden selection:bg-green-100">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-50/60 via-white to-white"></div>
      
      <main className="container px-4 flex flex-col items-center justify-center text-center gap-8 animate-fade-in-up">
        
        {/* App Name with 'Attractive' Font Style */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 drop-shadow-sm">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#17954c] to-[#1baa56]">
            Panda
          </span>
          Kost
        </h1>

        {/* Mascot Image */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float my-4">
          <Image
            src="/panda-login-white.png"
            alt="PandaKost Mascot"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Action Button */}
        <Link href="/login" className="w-full max-w-xs transition-transform hover:scale-105">
          <Button 
            size="lg" 
            className="w-full rounded-full h-14 text-lg font-bold shadow-xl shadow-green-200 bg-[#1baa56] hover:bg-[#158f48] text-white"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </main>

      {/* Simple Footer */}
      <footer className="absolute bottom-8 text-center text-xs text-gray-400 font-medium tracking-wide">
        © 2026 PANDAKOST
      </footer>
    </div>
  );
}
