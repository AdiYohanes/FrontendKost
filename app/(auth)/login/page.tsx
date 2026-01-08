"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, User, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth.schema";
import { authApi } from "@/lib/api/services/auth";
import { useAuthStore } from "@/lib/stores/authStore";
import { handleApiError } from "@/lib/api/errorHandler";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for session expired or redirect parameters
  useEffect(() => {
    const sessionExpired = searchParams.get("session");
    if (sessionExpired === "expired") {
      setError("Sesi Anda telah berakhir. Silakan masuk kembali.");
    }
  }, [searchParams]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call login API
      const response = await authApi.login(data);

      // Update auth store
      login(response.user, response.accessToken);

      // Check for redirect parameter
      const redirectTo = searchParams.get("redirect");

      // Redirect to original page or dashboard
      router.push(redirectTo || "/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);

      if (err instanceof AxiosError) {
        const errorMessage = handleApiError(err);
        if (!err.response && err.request) {
          setError(
            "❌ Tidak dapat terhubung ke server\n\n" +
              "Pastikan backend API berjalan."
          );
        } else {
          setError(errorMessage);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
      {/* Visual Section - Clean Design with Animation (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative p-8 bg-linear-to-br from-orange-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
        <div className="relative z-10 text-center">
          {/* Panda Container with Float Animation */}
          <div className="relative w-[500px] h-[500px] mx-auto mb-8 animate-float bg-transparent">
            <Image
              src="/panda-login-white.png"
              alt="Panda Mascot"
              fill
              className="object-contain drop-shadow-2xl dark:drop-shadow-[0_20px_50px_rgba(251,146,60,0.3)]"
              priority
            />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-backwards">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              Management Kost
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto">
              Kelola bisnis kost Anda dengan lebih pintar.
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 animate-in fade-in duration-1000 z-10">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Mobile Mascot */}
          <div className="lg:hidden w-40 h-40 md:w-56 md:h-56 mx-auto mb-6 relative animate-float">
            <Image
              src="/panda-login-white.png"
              alt="Panda Mascot"
              fill
              className="object-contain drop-shadow-xl dark:drop-shadow-[0_20px_50px_rgba(251,146,60,0.3)]"
            />
          </div>

          <div className="text-center lg:text-left space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Log in
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Silakan masuk untuk melanjutkan akses
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl flex items-start gap-3 animate-in shake duration-300">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400 whitespace-pre-line">
                {error}
              </p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-backwards">
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          {...field}
                          placeholder="Masukkan username"
                          disabled={isLoading}
                          className="h-14 pl-4 pr-10 rounded-2xl bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#1baa56] dark:focus:border-[#1baa56] focus:ring-[#1baa56] dark:focus:ring-[#1baa56] focus:ring-offset-0 transition-all duration-300 shadow-sm group-hover:border-[#1baa56]/50 dark:group-hover:border-[#148041]"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#1baa56] dark:group-focus-within:text-[#1baa56] transition-colors pointer-events-none duration-300">
                          <User className="h-5 w-5" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          {...field}
                          type="password"
                          placeholder="Masukkan password"
                          disabled={isLoading}
                          className="h-14 pl-4 pr-10 rounded-2xl bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#1baa56] dark:focus:border-[#1baa56] focus:ring-[#1baa56] dark:focus:ring-[#1baa56] focus:ring-offset-0 transition-all duration-300 shadow-sm group-hover:border-[#1baa56]/50 dark:group-hover:border-[#148041]"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-[#1baa56] dark:group-focus-within:text-[#1baa56] transition-colors pointer-events-none duration-300">
                          <Lock className="h-5 w-5" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards pt-2">
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#1baa56] hover:bg-[#148041] dark:bg-[#148041] dark:hover:bg-[#148041] text-white font-bold text-lg rounded-full shadow-lg shadow-[#1baa56]/30 dark:shadow-[#148041]/30 hover:shadow-[#1baa56]/50 dark:hover:shadow-[#148041]/50 hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 transition-all duration-300 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative my-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 fill-mode-backwards">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-950 px-2 text-gray-500 dark:text-gray-400 font-medium tracking-wider">
                Or
              </span>
            </div>
          </div>

          {/* Social Buttons (Visual Only) */}
          <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-backwards">
            <Button
              variant="outline"
              className="h-14 rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all justify-center group cursor-pointer"
              type="button"
            >
              <span className="mr-2 font-bold text-lg text-red-500 group-hover:scale-110 transition-transform">
                G
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                Sign in with Google
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all justify-center group cursor-pointer"
              type="button"
            >
              <span className="mr-2 font-bold text-lg text-blue-600 group-hover:scale-110 transition-transform">
                f
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                Sign in with Facebook
              </span>
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8 animate-in fade-in duration-1000 delay-700">
            For more information, please see our{" "}
            <Link
              href="#"
              className="underline hover:text-[#1baa56] dark:hover:text-[#1baa56] transition-colors cursor-pointer"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-slate-950">
          <Loader2 className="h-10 w-10 animate-spin text-[#1baa56]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

