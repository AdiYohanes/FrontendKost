"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react";

// StatusIcon component defined outside of render
function StatusIcon({
  status,
  loading,
}: {
  status: boolean;
  loading: boolean;
}) {
  if (loading) {
    return <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />;
  }
  return status ? (
    <CheckCircle2 className="h-5 w-5 text-green-500" />
  ) : (
    <XCircle className="h-5 w-5 text-red-500" />
  );
}

export default function PWATestPage() {
  const [pwaStatus, setPwaStatus] = useState({
    isStandalone: false,
    hasServiceWorker: false,
    hasManifest: false,
    isInstallable: false,
    dismissedAt: null as string | null,
    protocol: "",
    displayMode: "",
    userAgent: "",
  });
  const [loading, setLoading] = useState(true);

  const checkPWAStatus = useCallback(async () => {
    setLoading(true);

    // Check if running in standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    // Check if service worker is registered
    const hasServiceWorker = "serviceWorker" in navigator;
    let swRegistered = false;
    if (hasServiceWorker) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        swRegistered = registrations.length > 0;
      } catch (error) {
        console.error("Error checking service worker:", error);
      }
    }

    // Check if manifest is accessible
    let hasManifest = false;
    try {
      const response = await fetch("/manifest.json");
      hasManifest = response.ok;
    } catch (error) {
      console.error("Error checking manifest:", error);
    }

    // Check dismissal status
    const dismissedAt = localStorage.getItem("pwa-install-dismissed");

    // Get browser info
    const protocol = window.location.protocol;
    const displayMode = window.matchMedia("(display-mode: standalone)").matches
      ? "Standalone"
      : "Browser";
    const userAgent = navigator.userAgent;

    setPwaStatus({
      isStandalone,
      hasServiceWorker: swRegistered,
      hasManifest,
      isInstallable: !isStandalone && hasServiceWorker && hasManifest,
      dismissedAt,
      protocol,
      displayMode,
      userAgent,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    // Initial check
    void checkPWAStatus();

    // Listen for install events
    const beforeInstallHandler = () => {
      console.log("beforeinstallprompt event detected");
      setPwaStatus((prev) => ({ ...prev, isInstallable: true }));
    };

    const installedHandler = () => {
      console.log("appinstalled event detected");
      void checkPWAStatus();
    };

    window.addEventListener("beforeinstallprompt", beforeInstallHandler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallHandler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, [checkPWAStatus]);

  const clearDismissal = () => {
    localStorage.removeItem("pwa-install-dismissed");
    void checkPWAStatus();
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">PWA Installation Test</h1>
        <p className="text-muted-foreground">
          Check the PWA installation status and troubleshoot issues
        </p>
      </div>

      <div className="grid gap-6">
        {/* Overall Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Installation Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pwaStatus.isStandalone ? (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 dark:bg-green-950">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-300">
                      App is Installed
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Running in standalone mode
                    </p>
                  </div>
                </div>
              ) : pwaStatus.isInstallable ? (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                  <AlertCircle className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-semibold text-blue-700 dark:text-blue-300">
                      App is Installable
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Look for the install prompt at the bottom of the page
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-yellow-700 dark:text-yellow-300">
                      Not Installable
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      Check the requirements below
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Requirements Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Installation Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon
                    status={pwaStatus.hasServiceWorker}
                    loading={loading}
                  />
                  <span>Service Worker Registered</span>
                </div>
                <Badge
                  variant={
                    pwaStatus.hasServiceWorker ? "default" : "destructive"
                  }
                >
                  {pwaStatus.hasServiceWorker ? "Yes" : "No"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon
                    status={pwaStatus.hasManifest}
                    loading={loading}
                  />
                  <span>Manifest Available</span>
                </div>
                <Badge
                  variant={pwaStatus.hasManifest ? "default" : "destructive"}
                >
                  {pwaStatus.hasManifest ? "Yes" : "No"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon
                    status={!pwaStatus.isStandalone}
                    loading={loading}
                  />
                  <span>Not Already Installed</span>
                </div>
                <Badge
                  variant={!pwaStatus.isStandalone ? "default" : "secondary"}
                >
                  {!pwaStatus.isStandalone ? "Yes" : "Already Installed"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon
                    status={pwaStatus.protocol === "https:"}
                    loading={loading}
                  />
                  <span>HTTPS Connection</span>
                </div>
                <Badge
                  variant={
                    pwaStatus.protocol === "https:" ? "default" : "destructive"
                  }
                >
                  {pwaStatus.protocol === "https:" ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dismissal Status */}
        {pwaStatus.dismissedAt && (
          <Card>
            <CardHeader>
              <CardTitle>Install Prompt Dismissal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm">
                    <strong>Dismissed at:</strong>{" "}
                    {new Date(pwaStatus.dismissedAt).toLocaleString()}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The install prompt will not appear again for 7 days after
                    dismissal.
                  </p>
                </div>
                <Button onClick={clearDismissal} variant="outline">
                  Clear Dismissal (Show Prompt Again)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Browser Info */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User Agent:</span>
                <span className="max-w-md truncate text-right">
                  {pwaStatus.userAgent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Display Mode:</span>
                <span>{pwaStatus.displayMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Protocol:</span>
                <span>{pwaStatus.protocol}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={() => void checkPWAStatus()} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold">Chrome/Edge Desktop:</h4>
                <ol className="ml-4 mt-1 list-decimal space-y-1 text-muted-foreground">
                  <li>Wait for install prompt to appear (bottom-right)</li>
                  <li>Click &quot;Install&quot; button</li>
                  <li>Confirm in browser dialog</li>
                  <li>App will open in standalone window</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold">Chrome Mobile (Android):</h4>
                <ol className="ml-4 mt-1 list-decimal space-y-1 text-muted-foreground">
                  <li>Wait for install prompt to appear (bottom)</li>
                  <li>Tap &quot;Install&quot; button</li>
                  <li>Confirm &quot;Add to Home screen&quot;</li>
                  <li>App icon will appear on home screen</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold">Safari (iOS):</h4>
                <ol className="ml-4 mt-1 list-decimal space-y-1 text-muted-foreground">
                  <li>Tap Share button (square with arrow)</li>
                  <li>Scroll and tap &quot;Add to Home Screen&quot;</li>
                  <li>Tap &quot;Add&quot;</li>
                  <li>App icon will appear on home screen</li>
                </ol>
              </div>

              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> Safari doesn&apos;t support the
                  automatic install prompt. Users must manually add to home
                  screen via the Share menu.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
