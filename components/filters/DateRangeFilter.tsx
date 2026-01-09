"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface DateRangeFilterProps {
  startDate?: string;
  endDate?: string;
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onClear?: () => void;
}

export function DateRangeFilter({
  startDate = "",
  endDate = "",
  onDateRangeChange,
  onClear,
}: DateRangeFilterProps) {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
  }, [startDate, endDate]);

  const handleApply = () => {
    if (localStartDate && localEndDate) {
      onDateRangeChange(localStartDate, localEndDate);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setLocalStartDate("");
    setLocalEndDate("");
    onClear?.();
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return "Select date range";

    try {
      const start = format(new Date(startDate), "MMM dd, yyyy");
      const end = format(new Date(endDate), "MMM dd, yyyy");
      return `${start} - ${end}`;
    } catch {
      return "Select date range";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full md:w-[280px] justify-start text-left font-normal"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span className="truncate">{formatDateRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={localStartDate}
              onChange={(e) => setLocalStartDate(e.target.value)}
              max={localEndDate || undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={localEndDate}
              onChange={(e) => setLocalEndDate(e.target.value)}
              min={localStartDate || undefined}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleApply}
              disabled={!localStartDate || !localEndDate}
              className="flex-1"
            >
              Apply
            </Button>
            <Button variant="outline" onClick={handleClear} className="flex-1">
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
