import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateList } from "../hooks/list-hook";

const listingStatus = ["DRAFT", "REVIEW", "PUBLISHED"] as const;

const formSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  rentAmount: z.coerce.number().min(0, "Rent amount must be 0 or more"),
  amenitiesInput: z.string().optional(),
  rulesInput: z.string().optional(),
  availableFrom: z.string().min(1, "Available from date is required"),
  status: z.enum(listingStatus),
});

const toStringArray = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function CreateList() {
  const navigate = useNavigate();
  const { mutateAsync: createList, isPending } = useCreateList();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      rentAmount: 0,
      amenitiesInput: "",
      rulesInput: "",
      availableFrom: "",
      status: "DRAFT",
    },
  });

  const onSubmit = async (values: any) => {
    const payload = {
      title: values.title,
      description: values.description,
      location: values.location,
      rentAmount: Number(values.rentAmount),
      amenities: toStringArray(values.amenitiesInput),
      rules: toStringArray(values.rulesInput),
      availableFrom: new Date(values.availableFrom).toISOString(),
      status: values.status,
    };

    await toast.promise(createList(payload), {
      loading: "Creating list...",
      success: () => {
        navigate("/");
        return "List created successfully!";
      },
      error: "Failed to create list. Please try again.",
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-4xl space-y-5"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Listing</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel required>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="1 RK House for Rent" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel required>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Write property details, nearby landmarks, and highlights"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Location</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nand Ram Park, Uttam Nagar"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Rent Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="6000"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={Number(field.value ?? 0)}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availableFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Available From</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {listingStatus.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amenitiesInput"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Amenities</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="WiFi, Parking, Power Backup"
                    />
                  </FormControl>
                  <FormDescription>
                    Add comma-separated values. Example: WiFi, AC, Balcony
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rulesInput"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Rules</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="No smoking, No pets" />
                  </FormControl>
                  <FormDescription>
                    Add comma-separated values. Example: No parties, ID proof
                    required
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="px-5">
            {isPending ? "Creating..." : "Create Listing"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
