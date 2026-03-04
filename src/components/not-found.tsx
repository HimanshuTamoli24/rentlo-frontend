import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="mt-1 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/auth"
          className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Go to login
        </Link>
      </div>
    </div>
  );
}
