"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Home,
  Users,
  FileText,
  Wrench,
  ShoppingBag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/stores/authStore";
import { useRooms } from "@/lib/hooks/useRooms";
import { useResidents } from "@/lib/hooks/useResidents";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useComplaints } from "@/lib/hooks/useComplaints";
import { useFridgeItems } from "@/lib/hooks/useFridge";

interface SearchResult {
  id: string;
  type: "room" | "resident" | "invoice" | "complaint" | "fridge";
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface GlobalSearchRef {
  focus: () => void;
}

export const GlobalSearch = forwardRef<GlobalSearchRef>((props, ref) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  // Check permissions - PENGHUNI can only see their own data in dedicated pages
  // Global search is only for OWNER and PENJAGA who can see all data
  const canAccessRooms = user?.role === 'OWNER' || user?.role === 'PENJAGA';
  const canAccessResidents = user?.role === 'OWNER' || user?.role === 'PENJAGA';
  const canAccessInvoices = user?.role === 'OWNER' || user?.role === 'PENJAGA';
  const canAccessComplaints = user?.role === 'OWNER' || user?.role === 'PENJAGA';
  const canAccessFridge = user?.role === 'OWNER' || user?.role === 'PENJAGA';

  // Fetch data based on permissions
  const { data: rooms } = useRooms({ enabled: canAccessRooms });
  const { data: residents } = useResidents({ enabled: canAccessResidents });
  const { data: invoices } = useInvoices({ enabled: canAccessInvoices });
  const { data: complaints } = useComplaints({ enabled: canAccessComplaints });
  const { data: fridgeItems } = useFridgeItems({ enabled: canAccessFridge });

  // Expose focus method to parent
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
      setIsOpen(true);
    },
  }));

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Search results
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];

    const results: SearchResult[] = [];
    const lowerQuery = debouncedQuery.toLowerCase();

    // Search rooms
    if (rooms) {
      rooms
        .filter(
          (room) =>
            room.roomNumber.toLowerCase().includes(lowerQuery) ||
            room.floor?.toString().includes(lowerQuery)
        )
        .slice(0, 3)
        .forEach((room) => {
          results.push({
            id: room.id,
            type: "room",
            title: `Room ${room.roomNumber}`,
            subtitle: `Floor ${room.floor ?? "N/A"} • ${room.status}`,
            href: `/rooms/${room.id}`,
            icon: <Home className="h-4 w-4" />,
            badge: room.status,
          });
        });
    }

    // Search residents
    if (residents) {
      residents
        .filter(
          (resident) =>
            resident.user?.name?.toLowerCase().includes(lowerQuery) ||
            resident.user?.username?.toLowerCase().includes(lowerQuery) ||
            resident.room?.roomNumber?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 3)
        .forEach((resident) => {
          results.push({
            id: resident.id,
            type: "resident",
            title: resident.user?.name || resident.user?.username || "N/A",
            subtitle: `Room ${resident.room?.roomNumber || "N/A"}`,
            href: `/residents/${resident.id}`,
            icon: <Users className="h-4 w-4" />,
            badge: resident.isActive ? "Active" : "Inactive",
          });
        });
    }

    // Search invoices
    if (invoices) {
      invoices
        .filter(
          (invoice) =>
            invoice.invoiceNumber?.toLowerCase().includes(lowerQuery) ||
            invoice.resident?.user?.name?.toLowerCase().includes(lowerQuery) ||
            invoice.resident?.room?.roomNumber
              ?.toLowerCase()
              .includes(lowerQuery)
        )
        .slice(0, 3)
        .forEach((invoice) => {
          results.push({
            id: invoice.id,
            type: "invoice",
            title: invoice.invoiceNumber,
            subtitle: `${invoice.resident?.user?.name || "N/A"} • Room ${invoice.resident?.room?.roomNumber || "N/A"}`,
            href: `/invoices/${invoice.id}`,
            icon: <FileText className="h-4 w-4" />,
            badge: invoice.paymentStatus,
          });
        });
    }

    // Search complaints
    if (complaints) {
      complaints
        .filter(
          (complaint) =>
            complaint.title?.toLowerCase().includes(lowerQuery) ||
            complaint.description?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 3)
        .forEach((complaint) => {
          results.push({
            id: complaint.id,
            type: "complaint",
            title: complaint.title,
            subtitle: complaint.description?.substring(0, 50) + "...",
            href: `/complaints/${complaint.id}`,
            icon: <Wrench className="h-4 w-4" />,
            badge: complaint.status,
          });
        });
    }

    // Search fridge items
    if (fridgeItems) {
      fridgeItems
        .filter((item) => item.itemName?.toLowerCase().includes(lowerQuery))
        .slice(0, 3)
        .forEach((item) => {
          results.push({
            id: item.id,
            type: "fridge",
            title: item.itemName,
            subtitle: `Quantity: ${item.quantity} • Owner: ${item.resident?.user?.name || "N/A"}`,
            href: `/fridge`,
            icon: <ShoppingBag className="h-4 w-4" />,
          });
        });
    }

    return results.slice(0, 10); // Limit to 10 results
  }, [debouncedQuery, rooms, residents, invoices, complaints, fridgeItems]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen || searchResults.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : searchResults.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (searchResults[selectedIndex]) {
            handleNavigate(searchResults[selectedIndex].href);
          }
          break;
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  const handleNavigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search rooms, residents, invoices... (Ctrl+K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          aria-label="Global search"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-activedescendant={
            searchResults[selectedIndex]
              ? `search-result-${selectedIndex}`
              : undefined
          }
          role="combobox"
          aria-autocomplete="list"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && debouncedQuery.length >= 2 && (
        <Card
          id="search-results"
          className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-lg border-gray-200"
          role="listbox"
          aria-label="Search results"
        >
          {searchResults.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No results found for "{debouncedQuery}"
            </div>
          ) : (
            <div className="py-2">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  id={`search-result-${index}`}
                  onClick={() => handleNavigate(result.href)}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                    index === selectedIndex ? "bg-gray-50" : ""
                  }`}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      {result.badge && (
                        <Badge
                          variant="secondary"
                          className="text-xs flex-shrink-0"
                        >
                          {result.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {result.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
});

GlobalSearch.displayName = "GlobalSearch";
