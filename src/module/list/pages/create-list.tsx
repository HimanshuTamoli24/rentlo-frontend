import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateList } from "../hooks/list-hook";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function CreateList() {
  const navigate = useNavigate();
  const { mutateAsync: createList, isPending } = useCreateList();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "himanshutamoli2005@gmail.com",
      password: "himanshutamoli2005@gmail.com",
    },
  });

  const onSubmit = async (data: any) => {
    await toast.promise(createList(data), {
      loading: "Creating list...",
      success: () => {
        navigate(-1);
        return "List created successfully!";
      },
      error: "Failed to create list. Please try again.",
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="user@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
