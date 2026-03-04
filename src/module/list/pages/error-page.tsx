import { Link } from "react-router";

export default function ErrorPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 text-center">
        <p className="text-sm text-destructive">Error</p>
        <h1 className="mt-1 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again or go back to the user list.
        </p>
        <Link
          to="/users"
          className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Back to users
        </Link>
      </div>
    </div>
  );
}
