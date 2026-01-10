"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, X } from "lucide-react";
import { logger } from "@/lib/utils/logger";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      // Check if running in standalone mode (installed PWA)
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://");

      setIsInstalled(isStandalone);

      // Don't show prompt if already installed
      if (isStandalone) {
        logger.log("PWA is already installed");
        return true;
      }

      return false;
    };

    // Check installation status on mount
    if (checkInstallation()) {
      return;
    }

    // Check if user has previously dismissed the prompt
    const dismissedAt = localStorage.getItem("pwa-install-dismissed");
    if (dismissedAt) {
      const dismissedTime = new Date(dismissedAt).getTime();
      const now = new Date().getTime();
      const daysSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60 * 24);

      // Don't show prompt if dismissed within last 7 days
      if (daysSinceDismissed < 7) {
        logger.log(
          `PWA install prompt dismissed ${Math.floor(daysSinceDismissed)} days ago`
        );
        return;
      }
    }

    // Handle beforeinstallprompt event
    const handler = (e: Event) => {
      logger.log("beforeinstallprompt event fired");

      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show the install prompt after a short delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    // Handle app installed event
    const installedHandler = () => {
      logger.log("PWA was installed");
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);

      // Clear dismissed flag
      localStorage.removeItem("pwa-install-dismissed");
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      logger.error("No deferred prompt available");
      return;
    }

    try {
      setIsInstalling(true);

      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      logger.log(`User response to the install prompt: ${outcome}`);

      if (outcome === "accepted") {
        logger.log("User accepted the install prompt");
        // The appinstalled event will handle cleanup
      } else {
        logger.log("User dismissed the install prompt");
        // Store dismissal timestamp
        localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
      }

      // Clear the deferredPrompt for next time
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      logger.error("Error showing install prompt:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    logger.log("User manually dismissed install prompt");

    // Store dismissal timestamp
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());

    setShowPrompt(false);
  };

  // Don't render if already installed or prompt not available
  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 p-4 shadow-lg md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Install Kost Management</h3>
              <p className="text-sm text-muted-foreground">
                Install this app on your device for quick and easy access when
                you&apos;re on the go.
              </p>
            </div>
          </div>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleInstallClick}
            className="flex-1"
            disabled={isInstalling}
          >
            {isInstalling ? "Installing..." : "Install"}
          </Button>
          <Button onClick={handleDismiss} variant="outline" className="flex-1">
            Not now
          </Button>
        </div>
      </div>
    </Card>
  );
}
