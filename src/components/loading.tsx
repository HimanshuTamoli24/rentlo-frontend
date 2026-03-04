import { Spinner } from "@/components/ui/spinner";

export default function LoadingPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
        <Spinner className="size-5" />
        <p className="text-sm text-muted-foreground">Loading, please wait...</p>
      </div>
    </div>
  );
}
