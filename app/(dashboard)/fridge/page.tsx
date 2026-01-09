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
      <Card>
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

      {/* Items Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Fridge Items ({filteredItems.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No items found" : "No items in the fridge"}
              </p>
              {user?.role === UserRole.PENGHUNI && !searchQuery && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Item
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isMyItem = isOwner(item.ownerId);
              const canEdit = isMyItem || canEditAny;

              return (
                <Card
                  key={item.id}
                  className={`transition-all ${
                    isMyItem
                      ? "border-primary shadow-md"
                      : "border-muted opacity-80"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {item.itemName}
                          {isMyItem && (
                            <Badge variant="default" className="text-xs">
                              Your Item
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Owner: {item.resident?.user?.name || "Unknown"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Quantity */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Quantity:
                      </span>
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
                            className="w-20 h-8"
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              handleQuantityUpdate(
                                editingItem.id,
                                editingItem.quantity
                              )
                            }
                            disabled={updateMutation.isPending}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItem(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.quantity}</span>
                          {canEdit && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setEditingItem({
                                  id: item.id,
                                  quantity: item.quantity,
                                })
                              }
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Date In */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Added:
                      </span>
                      <span className="text-sm">
                        {item.dateIn
                          ? format(new Date(item.dateIn), "dd MMM yyyy")
                          : "N/A"}
                      </span>
                    </div>

                    {/* Actions */}
                    {canEdit && (
                      <div className="pt-2 border-t">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => setDeleteItemId(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Item
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
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
