"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useFridgeItems,
  useCreateFridgeItem,
  useUpdateFridgeItem,
  useDeleteFridgeItem,
} from "@/lib/hooks/useFridge";
import { useAuthStore } from "@/lib/stores/authStore";
import { UserRole } from "@/lib/api/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fridgeItemSchema,
  FridgeItemFormData,
} from "@/lib/validations/fridge.schema";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { Label } from "@/components/ui/label";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function FridgePage() {
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    quantity: number;
  } | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  // Fetch fridge items
  const { data: items, isLoading } = useFridgeItems();

  // Mutations
  const createMutation = useCreateFridgeItem();
  const updateMutation = useUpdateFridgeItem();
  const deleteMutation = useDeleteFridgeItem();

  // Form for adding items
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FridgeItemFormData>({
    resolver: zodResolver(fridgeItemSchema),
    defaultValues: {
      itemName: "",
      quantity: 1,
      dateIn: new Date().toISOString().split("T")[0],
    },
  });

  // Filter and search items
  const filteredItems = useMemo(() => {
    if (!items) return [];

    return items.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        item.itemName?.toLowerCase().includes(searchLower) ||
        item.resident?.user?.name?.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  }, [items, searchQuery]);

  // Check if user owns an item
  const isOwner = (ownerId: string) => {
    return user?.id === ownerId;
  };

  // Check if user can edit/delete any item
  const canEditAny =
    user?.role === UserRole.OWNER || user?.role === UserRole.PENJAGA;

  // Handle add item
  const onSubmit = async (data: FridgeItemFormData) => {
    try {
      await createMutation.mutateAsync({
        itemName: data.itemName,
        quantity: data.quantity,
      });
      toast.success("Item added to fridge successfully");
      setIsAddDialogOpen(false);
      reset();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  // Handle inline quantity edit
  const handleQuantityUpdate = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
        data: { quantity: newQuantity },
      });
      toast.success("Quantity updated successfully");
      setEditingItem(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteMutation.mutateAsync(deleteItemId);
      toast.success("Item removed from fridge successfully");
      setDeleteItemId(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shared Fridge</h1>
          <p className="text-muted-foreground">
            {user?.role === UserRole.PENGHUNI
              ? "Track your items in the shared fridge"
              : "Monitor all items in the shared fridge"}
          </p>
        </div>
        {user?.role === UserRole.PENGHUNI && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>

      {/* Search */}
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>Find items by name or owner</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search by item name or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-full bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-zinc-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
              <TableHead className="w-[30%] text-xs font-black uppercase tracking-widest text-zinc-400 py-6 pl-6">Item Name</TableHead>
              <TableHead className="w-[15%] text-xs font-black uppercase tracking-widest text-zinc-400 py-6">Quantity</TableHead>
              <TableHead className="w-[20%] text-xs font-black uppercase tracking-widest text-zinc-400 py-6">Owner</TableHead>
              <TableHead className="w-[20%] text-xs font-black uppercase tracking-widest text-zinc-400 py-6">Date Added</TableHead>
              <TableHead className="w-[15%] text-end text-xs font-black uppercase tracking-widest text-zinc-400 py-6 pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="p-6">
                    <Skeleton className="h-6 w-full rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-96 text-center">
                  <div className="flex flex-col items-center justify-center p-8">
                    <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                      <Package className="h-10 w-10 text-zinc-300" />
                    </div>
                    <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mb-1">
                      {searchQuery ? "No items found" : "No items in fridge"}
                    </h3>
                    <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6">
                      {searchQuery 
                        ? "We couldn't find any items matching your search." 
                        : "The shared fridge is currently empty."}
                    </p>
                    {user?.role === UserRole.PENGHUNI && !searchQuery && (
                      <Button onClick={() => setIsAddDialogOpen(true)} className="rounded-xl">
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Item
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                const isMyItem = isOwner(item.ownerId);
                const canEdit = isMyItem || canEditAny;

                return (
                  <TableRow 
                    key={item.id}
                    className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <TableCell className="py-6 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                            {item.itemName}
                          </span>
                          {isMyItem && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#1baa56]/10 text-[#1baa56]">
                              YOUR ITEM
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      {editingItem?.id === item.id ? (
                        <div className="flex items-center gap-2">
                           <Input
                             type="number"
                             min="1"
                             value={editingItem.quantity}
                             onChange={(e) =>
                               setEditingItem({
                                 ...editingItem,
                                 quantity: parseInt(e.target.value) || 1,
                               })
                             }
                             className="w-20 h-9 bg-white dark:bg-zinc-900 text-center font-bold"
                             autoFocus
                           />
                           <div className="flex gap-1">
                             <Button
                               size="icon"
                               className="h-9 w-9 bg-green-500 hover:bg-green-600 text-white"
                               onClick={() => handleQuantityUpdate(editingItem.id, editingItem.quantity)}
                               disabled={updateMutation.isPending}
                             >
                                <Plus className="h-4 w-4 rotate-0" />
                             </Button>
                             <Button
                               size="icon"
                               variant="ghost"
                               className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                               onClick={() => setEditingItem(null)}
                             >
                                <Trash2 className="h-4 w-4 rotate-45" />
                             </Button>
                           </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                           <span className="text-sm font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                             x{item.quantity}
                           </span>
                           {canEdit && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-zinc-400 hover:text-zinc-900 transition-all"
                                onClick={() => setEditingItem({ id: item.id, quantity: item.quantity })}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                           )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                          {(item.resident?.user?.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                           {item.resident?.user?.name || "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <span className="text-sm font-medium text-zinc-500">
                        {item.dateIn ? format(new Date(item.dateIn), "dd MMM yyyy") : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 pr-6 text-right">
                       {canEdit && (
                         <Button
                           variant="ghost"
                           size="sm"
                           className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-opacity"
                           onClick={() => setDeleteItemId(item.id)}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item to Fridge</DialogTitle>
            <DialogDescription>
              Add a new item to track in the shared fridge
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                placeholder="e.g., Milk, Eggs, Vegetables"
                {...register("itemName")}
                className={errors.itemName ? "border-red-500" : ""}
              />
              {errors.itemName && (
                <p className="text-sm text-red-500">
                  {errors.itemName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                {...register("quantity", { valueAsNumber: true })}
                className={errors.quantity ? "border-red-500" : ""}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Adding..." : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={!!deleteItemId}
        onOpenChange={(open) => !open && setDeleteItemId(null)}
        title="Remove Item"
        description="Are you sure you want to remove this item from the fridge? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
