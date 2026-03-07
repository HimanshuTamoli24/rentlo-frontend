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
      location: "Skyline Residency, Sector 45, Gurgaon",
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
        return "Listing created successfully!";
      },
      error: "Failed to create listing. Please try again.",
    });
  };

  return (
    <MainLayout
      title="Add New Listing"
      description="List your property and reach thousands of potential tenants."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Home className="size-5" />
                    </div>
                    <CardTitle className="text-xl">Basic Information</CardTitle>
                  </div>
                  <CardDescription>
                    Provide the essential details about your property.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="flex items-center gap-2">
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Sunny 1BHK near Metro"
                            className="bg-background/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className="flex items-center gap-2">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder="Tell potential tenants what makes your property special..."
                            className="bg-background/50 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            required
                            className="flex items-center gap-2"
                          >
                            <MapPin className="size-4" /> Location
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="City, Neighborhood"
                              className="bg-background/50"
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
                          <FormLabel
                            required
                            className="flex items-center gap-2"
                          >
                            <DollarSign className="size-4" /> Monthly Rent
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                min={0}
                                placeholder="0"
                                className="pl-7 bg-background/50"
                                {...field}
                                value={Number(field.value ?? 0)}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber || 0)
                                }
                              />
                            </div>
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
                          <FormLabel
                            required
                            className="flex items-center gap-2"
                          >
                            <Calendar className="size-4" /> Available From
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              className="bg-background/50"
                            />
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
                          <FormLabel
                            required
                            className="flex items-center gap-2"
                          >
                            <Info className="size-4" /> Listing Status
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background/50">
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
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <ListChecks className="size-5" />
                    </div>
                    <CardTitle className="text-xl">
                      Additional Details
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="amenitiesInput"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amenities</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="WiFi, Parking, AC, Pool..."
                            className="bg-background/50"
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated list of facilities available.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rulesInput"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>House Rules</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="No smoking, No pets, ID proof..."
                            className="bg-background/50"
                          />
                        </FormControl>
                        <FormDescription>
                          List any specific requirements or restrictions.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="px-8"
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="px-10 h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  {isPending ? "Listing..." : "Publish Listing"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className="sticky top-6">
            <div className="flex items-center gap-2 mb-4 px-2">
              <Sparkles className="size-4 text-primary animate-pulse" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Live Preview
              </h3>
            </div>

            <Card className="border-none shadow-2xl bg-card transition-all duration-300 overflow-hidden ring-1 ring-primary/5">
              <div className="p-1">
                <ListCard
                  listing={{
                    title: (formData.title as string) || "Your Property Title",
                    description:
                      (formData.description as string) ||
                      "Description will appear here...",
                    location: (formData.location as string) || "Location",
                    rentAmount: Number(formData.rentAmount) || 0,
                    status: (formData.status as string) || "DRAFT",
                  }}
                />
              </div>
              <Separator />
              <div className="p-4 bg-muted/30">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                  <span>
                    Available from: {formData.availableFrom || "Not set"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full ${formData.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {formData.status}
                  </span>
                </div>
              </div>
            </Card>

            <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <h4 className="font-semibold text-primary flex items-center gap-2 mb-2 italic">
                Pro Tip!
              </h4>
              <p className="text-sm text-balance leading-relaxed">
                Visualizing your listing helps you ensure that the property
                details and images will look great to potential tenants. Make
                sure your title is catchy and your location is precise!
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
