"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2, Save, Lock, User, Mail, Phone, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";

const profileSchema = z.object({
  lastname: z.string(),
  firstname: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const UpdateProfilePage = () => {
  const tScope = useScopedI18n("updateKamasProfile");
  const [isPasswordResetLoading, setIsPasswordResetLoading] =
    useState<boolean>(false);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [personalInfoError, setPersonalInfoError] = useState<string>("");

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      lastname: "",
      firstname: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      city: "",
      postalCode: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (
      !data.lastname &&
      !data.firstname &&
      !data.email &&
      !data.phone &&
      !data.address &&
      !data.country &&
      !data.city &&
      !data.postalCode
    ) {
      toast.error(tScope("emptyFieldError"), {
        style: { color: "#dc2626" },
      });
    } else {
      try {
        setIsLoading(true);
        await axios
          .post(`/api/iben/user/userInfo/${session?.user.id}`, data)
          .then((response) => {
            if (response.data.successMessage) {
              toast.success(tScope("successMessage"), {
                style: { color: "#16a34a" },
              });
            }
          });
        // Handle success (e.g., show a success message)
      } catch (error: any) {
        if (error?.response?.data?.errorMessage) {
          toast.error(tScope("errorMessage"), {
            style: { color: "#dc2626" },
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsPasswordResetLoading(true);
      await axios
        .post(`/api/iben/user/changeActiveUserPassword/${session?.user.id}`, {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        })
        .then((response) => {
          if (response.data.successMessage) {
            toast.success(tScope("changePasswordSuccessMessage"), {
              style: { color: "#16a34a" },
            });
            passwordForm.reset();
          }
        });
    } catch (error: any) {
      if (error?.response?.data?.errorMessage) {
        toast.error(tScope("changePasswordErrorMessage"), {
          style: { color: "#dc2626" },
        });
      }
    } finally {
      setIsPasswordResetLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          {tScope("title")}
        </h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
              <User className="mr-2" /> {tScope("personalInfoTitle")}
            </h2>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstname">{tScope("firstname")}</Label>
                  <Input
                    id="firstname"
                    {...profileForm.register("firstname")}
                    className="mt-1"
                  />
                  {profileForm.formState.errors.firstname && (
                    <p className="text-red-500 text-sm mt-1">
                      {profileForm.formState.errors.firstname.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastname">{tScope("lastname")}</Label>
                  <Input
                    id="lastname"
                    {...profileForm.register("lastname")}
                    className="mt-1"
                  />
                  {profileForm.formState.errors.lastname && (
                    <p className="text-red-500 text-sm mt-1">
                      {profileForm.formState.errors.lastname.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">{tScope("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register("email")}
                    className="mt-1"
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">{tScope("phone")}</Label>
                  <Input
                    id="phone"
                    {...profileForm.register("phone")}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">{tScope("address")}</Label>
                <Input
                  id="address"
                  {...profileForm.register("address")}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="city">{tScope("city")}</Label>
                  <Input
                    id="city"
                    {...profileForm.register("city")}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="country">{tScope("country")}</Label>
                  <Input
                    id="country"
                    {...profileForm.register("country")}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">{tScope("postalCode")}</Label>
                  <Input
                    id="postalCode"
                    {...profileForm.register("postalCode")}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto"
                aria-label="personnal information updates"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tScope("btnSaveLoading")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {tScope("btnSave")}
                  </>
                )}
              </Button>
            </form>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
              <Lock className="mr-2" /> {tScope("changePasswordTitle")}
            </h2>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="currentPassword">
                  {tScope("changePasswordCurrent")}
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register("currentPassword")}
                  className="mt-1"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="newPassword">
                  {tScope("changePasswordNew")}
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register("newPassword")}
                  className="mt-1"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword">
                  {tScope("changePasswordConfirm")}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                  className="mt-1"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto"
                aria-label="passowrd update"
              >
                {isPasswordResetLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tScope("changePasswordBtnLoading")}
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    {tScope("changePasswordBtn")}
                  </>
                )}
              </Button>
            </form>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateProfilePage;
