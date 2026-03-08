import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../../../hooks/use-auth";
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
import { Eye, EyeOff, UserCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/state.context.tsx";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: login, isPending } = useLogin();

  const demoAccounts = [
    {
      label: "Big boss Account",
      email: "bb@gmail.com",
      pass: "bb@gmail.com",
    },
    {
      label: "Owner Account",
      email: "owner@gmail.com",
      pass: "owner@gmail.com",
    },
    {
      label: "Tenant Account",
      email: "tenant@gmail.com",
      pass: "tenant@gmail.com",
    },
  ];

  const handleAccountSelect = (val: string) => {
    const acc = demoAccounts[parseInt(val)];
    if (acc) {
      form.setValue("email", acc.email);
      form.setValue("password", acc.pass);
      toast.info(`${acc.label} details filled`);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "bb@gmail.com",
      password: "bb@gmail.com",
    },
  });

  const { setUser, setRole, setIsAuth } = useAuth();

  const onSubmit = async (data: any) => {
    await toast.promise(login(data), {
      loading: "Logging in...",
      success: (res) => {
        const userData = res?.data || res;
        const role = userData?.role || "TENANT";

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", role);
        if (userData?.token) {
          localStorage.setItem("token", userData.token);
        }
        console.log("user ALL", res);
        setIsAuth(true);
        setRole(role);
        setUser(userData);

        switch (role) {
          case "OWNER":
          case "TENANT":
            navigate("/owner-tenant");
            break;
          case "BIGBOSS":
            navigate("/bigboss");
            break;
        }

        return "Login successful!";
      },
      error: "Login failed. Please check your credentials and try again.",
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 mb-6 group transition-all hover:bg-primary/10">
          <label className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2 block px-1">
            Quick Fill Access
          </label>
          <Select onValueChange={handleAccountSelect}>
            <SelectTrigger className="bg-white/50 border-none shadow-none focus:ring-0 h-9 w-full">
              <div className="flex items-center gap-2">
                <UserCircle className="size-4 text-primary" />
                <SelectValue placeholder="Choose a demo account" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {demoAccounts.map((acc, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {acc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Password </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
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
