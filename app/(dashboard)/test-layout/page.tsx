"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function TestLayoutPage() {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    breakpoint: "",
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let breakpoint = "";

      if (width < 640) breakpoint = "Mobile (< 640px)";
      else if (width < 768) breakpoint = "Mobile Landscape (640px - 768px)";
      else if (width < 1024) breakpoint = "Tablet (768px - 1024px)";
      else if (width < 1280) breakpoint = "Desktop (1024px - 1280px)";
      else breakpoint = "Large Desktop (>= 1280px)";

      setScreenSize({ width, height, breakpoint });
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Layout Responsiveness Test
        </h1>
        <p className="text-muted-foreground mt-2">
          Resize your browser window to test responsive behavior
        </p>
      </div>

      {/* Screen Size Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Screen Size</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Width</p>
              <p className="text-2xl font-bold">{screenSize.width}px</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="text-2xl font-bold">{screenSize.height}px</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Breakpoint</p>
              <Badge variant="outline" className="text-base mt-1">
                {screenSize.breakpoint}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout Features */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Features by Breakpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Mobile (&lt; 768px)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Desktop sidebar hidden</li>
                <li>Mobile menu button visible in header</li>
                <li>Mobile sidebar opens as drawer/sheet</li>
                <li>Single column layout</li>
                <li>Padding: 1rem (p-4)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Tablet (768px - 1024px)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Desktop sidebar visible</li>
                <li>Sidebar can collapse/expand</li>
                <li>Mobile menu button hidden</li>
                <li>Two column layouts where appropriate</li>
                <li>Padding: 1.5rem (p-6)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Desktop (&gt;= 1024px)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Full desktop sidebar visible</li>
                <li>Sidebar can collapse/expand</li>
                <li>Multi-column layouts</li>
                <li>Maximum content width: 1280px (max-w-7xl)</li>
                <li>Padding: 2rem (p-8)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Grid Test */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Grid Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center"
              >
                <p className="font-semibold">Card {i}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Responsive grid item
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">To test the layout:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>
                <strong>Mobile (&lt; 768px):</strong> Resize browser to mobile
                width. Click the menu icon in header to open mobile sidebar.
              </li>
              <li>
                <strong>Tablet (768px - 1024px):</strong> Sidebar should appear
                on the left. Test collapse/expand functionality.
              </li>
              <li>
                <strong>Desktop (&gt;= 1024px):</strong> Full sidebar visible.
                Content should be centered with max-width.
              </li>
              <li>Test navigation between pages to ensure layout persists.</li>
              <li>
                Test sidebar collapse state is preserved across page navigation.
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
