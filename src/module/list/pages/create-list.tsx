import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
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
import { faker } from "@faker-js/faker";
import { useCreateList } from "../hooks/list-hook";
import MainLayout from "@/components/main-layout";
import ListCard from "./component/list-card";
import SEO from "@/components/seo";
import { confirm } from "@/components/alert-box";

const listingStatus = ["DRAFT", "APPROVED", "REJECTED"] as const;

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
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

const generateFakeData = () => {
  return {
    title: faker.helpers.arrayElement(["Luxury", "Cozy", "Spacious", "Modern", "Premium", "Affordable"]) + " " + faker.helpers.arrayElement(["Apartment", "Villa", "Studio", "House", "Penthouse"]) + " in " + faker.location.city(),
    description: faker.lorem.paragraphs(2),
    location: faker.helpers.arrayElement(indianStates),
    rentAmount: faker.number.int({ min: 10000, max: 200000 }),
    amenitiesInput: faker.helpers.arrayElements(["WiFi", "AC", "Parking", "Gym", "Pool", "Balcony", "Security", "Power Backup", "Clubhouse", "Lift"], { min: 3, max: 6 }).join(", "),
    rulesInput: faker.helpers.arrayElements(["No smoking", "Families preferred", "ID proof required", "No pets", "Vegetarians only", "Bachelors allowed"], { min: 1, max: 3 }).join(", "),
    availableFrom: faker.date.soon({ days: 30 }).toISOString().split("T")[0],
    // status: "APPROVED",
  };
};

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

    const ok = await confirm.create({
      title: "Create Listing",
      message: "Are you sure you want to create this listing?",
      confirmText: "Create",
      cancelText: "Cancel",
    });
    if (!ok) return;

    await toast.promise(createList(payload), {
      loading: "Creating listing...",
      success: () => {
        navigate("/");
        return "Listing created";
      },
      error: "Failed to create listing",
    });
  };

  const fillFakeData = () => {
    form.reset(generateFakeData());
    toast.success("Form filled with fake data!");
  };

  const seedMultiple = async () => {
    const ok = await confirm.create({
      title: "Seed Fake Data",
      message: "Are you sure you want to instantly create 10 fake listings?",
      confirmText: "Yes, Seed",
      cancelText: "Cancel",
    });
    if (!ok) return;

    const toastId = toast.loading("Seeding 10 listings...");
    try {
      for (let i = 0; i < 10; i++) {
        const fake = generateFakeData();
        await createList({
          title: fake.title,
          description: fake.description,
          location: fake.location,
          rentAmount: Number(fake.rentAmount),
          amenities: toStringArray(fake.amenitiesInput),
          rules: toStringArray(fake.rulesInput),
          availableFrom: new Date(fake.availableFrom).toISOString(),
        });
      }
      toast.success("Successfully seeded 10 fake listings!", { id: toastId });
    } catch (err) {
      toast.error("Error while seeding data", { id: toastId });
    }
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
            <Card className="bg-accent/30">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4 bg-muted p-2 rounded-sm">
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
                </div>
                {/* GRID */}
                <div className="grid gap-4 md:grid-cols-3 w-full bg-muted p-2 rounded-sm ">
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

                          <SelectContent className="max-w-sm  max-h-40  overflow-y-auto truncate">
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                            <SelectItem value="KIHEAT">
                              KIHEAT
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

                <div className="bg-muted rounded-sm p-2">
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

                  <FormField
                    control={form.control}
                    name="rulesInput"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rules</FormLabel>
                        <Input
                          placeholder="No smoking, ID required"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* ACTIONS */}
            <div className="flex flex-wrap justify-between gap-3">
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={fillFakeData}>
                  Fill Fake Data
                </Button>
                <Button type="button" variant="destructive" onClick={seedMultiple} disabled={isPending}>
                  Seed 10 Listings
                </Button>
              </div>
              <div className="flex gap-2">
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
            </div>
          </form>
        </FormProvider>

        {/* PREVIEW */}

        <div className="sticky top-10 bg-muted/75 p-4 rounded-lg">
          <h1>Preview of your Property...</h1>
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
