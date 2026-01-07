"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Home } from "lucide-react";

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
import { AxiosError } from "axios";

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

      // Update auth store (this will also store token in localStorage)
      login(response.user, response.accessToken);

      // Check for redirect parameter
      const redirectTo = searchParams.get("redirect");

      // Redirect to original page or dashboard
      router.push(redirectTo || "/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);

      // Use error handler for consistent error messages
      if (err instanceof AxiosError) {
        const errorMessage = handleApiError(err);

        // Check if it's a network error
        if (!err.response && err.request) {
          // Network error - show detailed message
          setError(
            "❌ Tidak dapat terhubung ke server\n\n" +
              "Pastikan:\n" +
              "1. Backend API berjalan di http://localhost:3000\n" +
              "2. Jalankan: cd ../KostManagement && npm run start:dev\n" +
              "3. Cek file .env.local sudah benar\n\n" +
              "Lihat TROUBLESHOOTING.md untuk panduan lengkap"
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
    <div className="min-h-screen w-full flex flex-col bg-background">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <Home className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Selamat Datang
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Masuk ke akun Kost Management Anda
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {error}
                  </div>
                </div>
              )}

              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan username"
                        autoComplete="username"
                        disabled={isLoading}
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Masukkan password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 px-6">
        <p className="text-center text-xs text-muted-foreground">
          Sistem Manajemen Kost v1.0
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
