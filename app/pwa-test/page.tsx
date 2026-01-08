"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PWATestPage() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [swRegistration, setSwRegistration] = useState<
    ServiceWorkerRegistration | undefined
  >();
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check if installed as PWA
    setIsInstalled(window.matchMedia("(display-mode: standalone)").matches);

    // Check service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        setSwRegistration(registration);
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const unregisterSW = async () => {
    if (swRegistration) {
      await swRegistration.unregister();
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">PWA Test Page</h1>

      <div className="space-y-4">
        {/* Online Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Network Status</h2>
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Try toggling your network connection to test offline functionality.
          </p>
        </Card>

        {/* Service Worker Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Service Worker</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span>Registered:</span>
              <Badge variant={swRegistration ? "default" : "secondary"}>
                {swRegistration ? "Yes" : "No"}
              </Badge>
            </div>
            {swRegistration && (
              <>
                <div className="flex items-center gap-2">
                  <span>State:</span>
                  <Badge variant="outline">
                    {swRegistration.active?.state || "Unknown"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>Scope:</span>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {swRegistration.scope}
                  </code>
                </div>
                <Button
                  onClick={unregisterSW}
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                >
                  Unregister Service Worker
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Installation Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Installation Status</h2>
          <div className="flex items-center gap-2">
            <span>Installed as PWA:</span>
            <Badge variant={isInstalled ? "default" : "secondary"}>
              {isInstalled ? "Yes" : "No"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {isInstalled
              ? "This app is running as an installed PWA."
              : "This app is running in a browser. Look for the install button in the address bar or use the install prompt."}
          </p>
        </Card>

        {/* Browser Support */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Browser Support</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span>Service Worker:</span>
              <Badge
                variant={
                  typeof navigator !== "undefined" &&
                  "serviceWorker" in navigator
                    ? "default"
                    : "secondary"
                }
              >
                {typeof navigator !== "undefined" &&
                "serviceWorker" in navigator
                  ? "Supported"
                  : "Not Supported"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Cache API:</span>
              <Badge
                variant={
                  typeof window !== "undefined" && "caches" in window
                    ? "default"
                    : "secondary"
                }
              >
                {typeof window !== "undefined" && "caches" in window
                  ? "Supported"
                  : "Not Supported"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Notifications:</span>
              <Badge
                variant={
                  typeof window !== "undefined" && "Notification" in window
                    ? "default"
                    : "secondary"
                }
              >
                {typeof window !== "undefined" && "Notification" in window
                  ? "Supported"
                  : "Not Supported"}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Testing Instructions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Open DevTools → Application → Service Workers to see registration
            </li>
            <li>
              Check the &quot;Offline&quot; checkbox in DevTools to simulate
              offline mode
            </li>
            <li>Refresh the page - it should still load from cache</li>
            <li>
              Look for the install button in the browser address bar
              (Chrome/Edge)
            </li>
            <li>
              On mobile, use the browser menu to &quot;Add to Home Screen&quot;
            </li>
            <li>
              Run Lighthouse audit (DevTools → Lighthouse) to check PWA score
            </li>
          </ol>
        </Card>

        {/* Manifest Link */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <div className="space-y-2">
            <div>
              <a
                href="/manifest.json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View manifest.json
              </a>
            </div>
            <div>
              <a
                href="/sw.js"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View service worker (sw.js)
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
