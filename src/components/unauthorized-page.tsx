import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[120px] animate-pulse" />

      <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in duration-500">
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 text-center space-y-8">
          {/* Icon with Ring Animation */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping duration-[3000ms]" />
            <div className="relative w-20 h-20 rounded-3xl bg-linear-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20 rotate-3">
              <Lock className="size-10 text-white -rotate-3" />
            </div>
            <div className="absolute -top-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-1.5 shadow-sm border">
              <ShieldAlert className="size-5 text-red-500" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Access Restricted
            </h1>
            <p className="text-muted-foreground text-balanced leading-relaxed">
              It looks like you don't have the clearance to enter this section.
              Please verify your account permissions or head back to safety.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="h-12 rounded-2xl border-2 hover:bg-secondary transition-all gap-2 font-semibold"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </Button>

            <Button
              asChild
              className="h-12 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-semibold"
            >
              <Link to="/">
                <Home className="size-4" />
                Home Page
              </Link>
            </Button>
          </div>

          <div className="pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              Need help?{" "}
              <Link
                to="/auth"
                className="text-primary font-bold hover:underline"
              >
                Sign in with a different account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
