"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterPanelProps {
  children: ReactNode;
  onClearAll?: () => void;
  showClearButton?: boolean;
}

export function FilterPanel({
  children,
  onClearAll,
  showClearButton = true,
}: FilterPanelProps) {
  return (
    <div className="p-0">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col md:flex-row gap-4">{children}</div>
        {showClearButton && onClearAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="md:self-start h-10 border-zinc-200 text-zinc-500 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all rounded-xl"
          >
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
