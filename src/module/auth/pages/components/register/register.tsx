import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../../../hooks/use-auth";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Register() {
  const mutation = useRegister();
  const { mutateAsync: registerFn, isLoading } = mutation;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: any) => {
    try {
      await toast.promise(registerFn(data), {
        loading: "Registering...",
        success: "Registration successful!",
        error: "Registration failed. Please try again.",
      });
    } catch (e) {
      // handled by toast
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold">Create account</h2>

      <div>
        <label className="block text-sm">Name</label>
        <input
          {...form.register("name")}
          className="mt-1 block w-full border px-2 py-1"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-600">
            {String(form.formState.errors.name.message)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm">Email</label>
        <input
          {...form.register("email")}
          type="email"
          className="mt-1 block w-full border px-2 py-1"
          placeholder="you@example.com"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-600">
            {String(form.formState.errors.email.message)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm">Password</label>
        <input
          {...form.register("password")}
          type="password"
          className="mt-1 block w-full border px-2 py-1"
          placeholder="••••••••"
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-600">
            {String(form.formState.errors.password.message)}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {isLoading ? "Creating..." : "Create account"}
        </button>
      </div>
    </form>
  );
}
