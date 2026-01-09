"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <Card className="p-8 md:p-12" role="status" aria-label={title}>
      <div className="text-center space-y-4">
        {Icon && (
          <div className="flex justify-center" aria-hidden="true">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-muted flex items-center justify-center">
              <Icon className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-lg md:text-xl font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
            {description}
          </p>
        </div>
        {action && (
          <div className="pt-2">
            <Button
              onClick={action.onClick}
              variant={action.variant || "default"}
              size="lg"
            >
              {action.label}
            </Button>
          </div>
        )}
        {children}
      </div>
    </Card>
  );
}
