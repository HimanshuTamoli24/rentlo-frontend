import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl border bg-card p-10 shadow-lg">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have the required permissions to view this page. If you
            believe this is a mistake, please contact an administrator.
          </p>
        </div>
        <div className="flex gap-4 w-full pt-4 relative">
          <Button asChild className="w-full" variant="default">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild className="w-full" variant="outline">
            <Link to="/auth">Sign In Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
