"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, CreditCard, MapPin, PhoneCall, Save, Loader2, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { profileApi } from "@/lib/api/services/profile";
import { useAuthStore } from "@/lib/stores/authStore";
import {
  basicProfileSchema,
  detailProfileSchema,
  type BasicProfileFormData,
  type DetailProfileFormData,
} from "@/lib/validations/profile.schema";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingBasic, setIsSavingBasic] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  // Basic Info Form
  const basicForm = useForm<BasicProfileFormData>({
    resolver: zodResolver(basicProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  // Details Form
  const detailsForm = useForm<DetailProfileFormData>({
    resolver: zodResolver(detailProfileSchema),
    defaultValues: {
      idCard: "",
      address: "",
      emergencyContact: "",
      emergencyContactName: "",
    },
  });

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await profileApi.getProfile();
        
        // Update store
        setUser(profileData);

        // Reset forms with fetched data
        basicForm.reset({
          name: profileData.name || "",
          email: profileData.email || "",
          phoneNumber: profileData.phoneNumber || "",
          password: "", // Always empty
        });

        detailsForm.reset({
          idCard: profileData.profile?.idCard || "",
          address: profileData.profile?.address || "",
          emergencyContact: profileData.profile?.emergencyContact || "",
          emergencyContactName: profileData.profile?.emergencyContactName || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Gagal memuat profil user");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [setUser, basicForm, detailsForm]);

  // Handle Basic Info Submit
  const onBasicSubmit = async (data: BasicProfileFormData) => {
    try {
      setIsSavingBasic(true);
      
      // Remove empty strings to send cleaner data (schema handles validation)
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== "" && v !== undefined)
      );

      const updatedUser = await profileApi.updateProfile(cleanData);
      setUser(updatedUser);
      
      toast.success("Informasi dasar berhasil diperbarui");
      basicForm.setValue("password", ""); // Clear password field
    } catch (error) {
      console.error("Failed to update basic info:", error);
      toast.error("Gagal memperbarui informasi dasar");
    } finally {
      setIsSavingBasic(false);
    }
  };

  // Handle Details Submit
  const onDetailsSubmit = async (data: DetailProfileFormData) => {
    try {
      setIsSavingDetails(true);
      
      // Filter out emergency contacts temporarily as backend schema doesn't support them yet
      // causing "Unknown argument `emergencyContact`" 500 error
      const { emergencyContact, emergencyContactName, ...safeData } = data;
      
      const updatedUser = await profileApi.updateProfileDetails(safeData);
      setUser(updatedUser);
      
      toast.success("Detail profil berhasil diperbarui");
    } catch (error) {
      console.error("Failed to update details:", error);
      toast.error("Gagal memperbarui detail profil");
    } finally {
      setIsSavingDetails(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1baa56]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Profile Settings</h2>
        <p className="text-gray-500">
          Kelola informasi profil dan detail akun Anda.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Basic Information Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCircle className="h-5 w-5 text-[#1baa56]" />
              Informasi Dasar
            </CardTitle>
            <CardDescription>
              Update nama, email, dan password Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...basicForm}>
              <form onSubmit={basicForm.handleSubmit(onBasicSubmit)} className="space-y-4">
                <FormField
                  control={basicForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input className="pl-9" placeholder="Nama Anda" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={basicForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input className="pl-9" placeholder="email@example.com" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={basicForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input className="pl-9" placeholder="+62..." {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-4" />

                <FormField
                  control={basicForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Baru (Opsional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input 
                            type="password" 
                            className="pl-9" 
                            placeholder="Biarkan kosong jika tidak ingin mengubah" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>Minimal 6 karakter.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    className="bg-[#1baa56] hover:bg-[#158f46] text-white"
                    disabled={isSavingBasic}
                  >
                    {isSavingBasic && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Detailed Information Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-5 w-5 text-[#1baa56]" />
              Detail Profil
            </CardTitle>
            <CardDescription>
              Informasi tambahan untuk keperluan administrasi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...detailsForm}>
              <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-4">
                <FormField
                  control={detailsForm.control}
                  name="idCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor KTP</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input className="pl-9" placeholder="16 digit nomor KTP" maxLength={16} {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={detailsForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Textarea 
                            className="pl-9 min-h-[100px]" 
                            placeholder="Jl. Contoh No. 123..." 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* NOTE: Backend schema currently does NOT support emergency contact fields.
                    Error: Unknown argument `emergencyContact`.
                    Hiding these fields until backend is updated.
                */}
                {/* <Separator className="my-4" />

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={detailsForm.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kontak Darurat (HP)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <PhoneCall className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input className="pl-9" placeholder="+62..." {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={detailsForm.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Kontak Darurat</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input className="pl-9" placeholder="Misal: Istri/Suami" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    variant="outline"
                    className="border-[#1baa56] text-[#1baa56] hover:bg-[#1baa56] hover:text-white"
                    disabled={isSavingDetails}
                  >
                    {isSavingDetails && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Detail
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
