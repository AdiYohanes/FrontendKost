"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useCreateComplaint } from "@/lib/hooks/useComplaints";
import {
  complaintSchema,
  ComplaintFormData,
} from "@/lib/validations/complaint.schema";

export default function NewComplaintPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState("");

  // Create complaint mutation
  const createComplaint = useCreateComplaint();

  // Form setup
  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      title: "",
      description: "",
      photos: [],
    },
  });

  // Handle adding photo URL
  const handleAddPhoto = () => {
    if (photoInput.trim()) {
      const newPhotos = [...photoUrls, photoInput.trim()];
      setPhotoUrls(newPhotos);
      form.setValue("photos", newPhotos);
      setPhotoInput("");
    }
  };

  // Handle removing photo URL
  const handleRemovePhoto = (index: number) => {
    const newPhotos = photoUrls.filter((_, i) => i !== index);
    setPhotoUrls(newPhotos);
    form.setValue("photos", newPhotos);
  };

  // Handle form submission
  const onSubmit = async (data: ComplaintFormData) => {
    try {
      setIsSubmitting(true);
      // Transform data to match API expectations
      const submitData = {
        title: data.title,
        description: data.description,
        photos: data.photos.length > 0 ? data.photos : undefined,
      };
      await createComplaint.mutateAsync(submitData);
      toast.success("Complaint submitted successfully");
      router.push("/complaints");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit complaint";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/complaints">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Submit Complaint</h1>
          <p className="text-muted-foreground">Report an issue or concern</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
          <CardDescription>
            Provide details about your complaint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief description of the issue"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Maximum 100 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the issue..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum 1000 characters. Please provide as much detail as
                      possible.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photos */}
              <div className="space-y-4">
                <div>
                  <Label>Photos (Optional)</Label>
                  <p className="text-sm text-muted-foreground">
                    Add photo URLs to support your complaint
                  </p>
                </div>

                {/* Photo URL Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter photo URL (e.g., https://example.com/photo.jpg)"
                    value={photoInput}
                    onChange={(e) => setPhotoInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddPhoto();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddPhoto}
                    disabled={!photoInput.trim()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Photo List */}
                {photoUrls.length > 0 && (
                  <div className="space-y-2">
                    {photoUrls.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 border rounded-md"
                      >
                        <div className="flex-1 truncate text-sm">{url}</div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Complaint
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/complaints")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
