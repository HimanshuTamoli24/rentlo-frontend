import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateList } from "../hooks/list-hook";
import MainLayout from "@/components/main-layout";
import ListCard from "./component/list-card";
import { Separator } from "@/components/ui/separator";
import SEO from "@/components/seo";
import {
  Sparkles,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  ListChecks,
  Info,
} from "lucide-react";

const listingStatus = ["DRAFT", "APPROVED", "REJECTED"] as const;

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
      title: "Luxury 2BHK Apartment with Balcony",
      description:
        "Beautiful fully furnished apartment located in the heart of the city. Features a spacious living room, modular kitchen, and an east-facing balcony with a great view. Close to metro and shopping malls.",
      location: "epsteinisland",
      rentAmount: 25000,
      amenitiesInput: "WiFi, AC, Parking, Gym, Pool",
      rulesInput: "No smoking, Families preferred, ID proof required",
      availableFrom: new Date().toISOString().split("T")[0],
      status: "DRAFT",
    },
  });

  const formData = useWatch({ control: form.control }) as any;

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
      loading: "Creating listing...",
      success: () => {
        navigate("/");
        return "Listing created";
      },
      error: "Failed to create listing",
    });
  };

  return (
    <MainLayout>
      <MainLayout.Title title="Create Listing" breadcrumb="Dashboard" />
      <SEO
        title="List Your Property"
        description="Reach thousands of potential tenants. Create a professional listing for your property with Rentlo's intuitive interface."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        {/* FORM */}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* TITLE */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="2BHK near metro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DESCRIPTION */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* GRID */}
                <div className="grid gap-4 md:grid-cols-3 w-full">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel required>Location</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder="Select location"
                                className="truncate"
                              />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent className="max-w-sm truncate">
                            <SelectItem value="epsteinisland">
                              Epstein island
                            </SelectItem>
                            <SelectItem value="jaipur">Jaipur </SelectItem>
                            <SelectItem value="patiala">Patiala </SelectItem>
                            <SelectItem value="chaicode">
                              Chaicode HeadQuater
                            </SelectItem>
                            <SelectItem value="more" className="truncate">
                              More option buy our 69dollar plan :)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rentAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Rent</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={Number(field.value ?? 0)}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availableFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available From</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* AMENITIES */}
                <FormField
                  control={form.control}
                  name="amenitiesInput"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amenities</FormLabel>
                      <Input placeholder="WiFi, Parking, Gym" {...field} />
                    </FormItem>
                  )}
                />

                {/* RULES */}
                <FormField
                  control={form.control}
                  name="rulesInput"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rules</FormLabel>
                      <Input placeholder="No smoking, ID required" {...field} />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Listing"}
              </Button>
            </div>
          </form>
        </FormProvider>

        {/* PREVIEW */}

        <div className="sticky top-10 bg-muted/75 p-4 rounded-lg">
          <h1>Preview of your list...</h1>
          <ListCard
            listing={{
              title: formData.title || "Preview title",
              description: formData.description || "Preview description",
              location: formData.location || "Location",
              rentAmount: Number(formData.rentAmount) || 0,
              status: formData.status || "DRAFT",
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
}
