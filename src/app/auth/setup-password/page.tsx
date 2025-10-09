"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthCheck } from "../components/auth-check";
import Logo from "@/components/shares/logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  setUpPasswordData,
  setUpPasswordSchema,
} from "@/utils/schemas/setup-password-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSetupPasswordMutation } from "@/lib/services/clientHooks/setupPassword";
import { toast } from "sonner";

export default function SetupPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [setUpPassword, { isLoading }] = useSetupPasswordMutation();

  const form = useForm<setUpPasswordData>({
    resolver: zodResolver(setUpPasswordSchema),
  });

  useEffect(() => {
    const inviteToken = searchParams.get("token");
    if (inviteToken) {
      setToken(inviteToken);
    } else {
      setError("Invalid invitation link");
    }
  }, [searchParams]);

  const onSubmit = async (data: setUpPasswordData) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { confirmPassword, ...rest } = data;
    try {
      await setUpPassword({
        token,
        userData: rest,
      }).unwrap();
      toast.success("Account setup successful!");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to set up account. Please try again.");
    }
  };

  if (!token && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthCheck requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center flex justify-center">
            <Logo size={40} className="text-primary" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Setup</CardTitle>
              <CardDescription>
                Enter your details to complete your account setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="monthlyShareCommitment"
                    render={({ field }) => (
                      <FormItem className=" p-0 gap-2">
                        <FormLabel className="font-normal">
                          <div className="flex gap-1 justify-between items-center w-full">
                            <Label className="text-sm font-normal">
                              Monthly Share Commitment
                            </Label>
                            <span className="text-xs font-normal text-muted-foreground">
                              (2000 RWF/Share)
                            </span>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter your share commitment"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                        <span className="text-xs text-muted-foreground">
                          ({(form.watch("monthlyShareCommitment") ?? 0) * 2000}
                          &nbsp;RWF) This will be your monthly contribution
                        </span>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your phone number"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your password"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Confirm your password"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !token}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Setting up account...
                      </>
                    ) : (
                      "Complete Setup"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthCheck>
  );
}
