import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full py-12 px-4 md:px-6 mt-12 bg-white border-t border-gray-100 overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer w-fit">
              <span className="text-2xl font-bold tracking-tighter bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                Rentlo
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              The modern way to track users, visits, and property metrics with a
              beautiful and intuitive interface. Simplified property management
              for everyone.
            </p>
            {/* <div className="flex items-center gap-4">
              <a
                href="https://github.com/HimanshuTamoli24/rentlo-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
              >
                <Github className="size-5" />
              </a>
              <a
                href="#"
                className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-muted-foreground hover:bg-blue-400 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
              >
                <Twitter className="size-5" />
              </a>
              <a
                href="#"
                className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
              >
                <Linkedin className="size-5" />
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">
              Repositories
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://github.com/HimanshuTamoli24/rentlo-frontend"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  Frontend Repo
                  <span className="w-0 group-hover:w-4 h-px bg-primary transition-all duration-300" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/HimanshuTamoli24/renlo-backend"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  Backend Repo
                  <span className="w-0 group-hover:w-4 h-px bg-primary transition-all duration-300" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.amazon.in/Mom-Says-Girlfriend-Subhasis-Das/dp/8129117037"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  My Girl friend
                  <span className="w-0 group-hover:w-4 h-px bg-primary transition-all duration-300" />
                </a>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">
              Explore
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Find a Home
                </a>
              </li>
              <li>
                <a
                  href="/bigboss"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Admin Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/auth"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Member Access
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground font-medium">
            © {new Date().getFullYear()} Rentlo. All rights reserved. Built with
            precision.
          </p>
          <p className="text-xs flex items-center gap-1.5 font-semibold text-muted-foreground">
            Crafted with <Heart className="size-3 text-red-500 fill-red-500" />{" "}
            by{" "}
            <span className="text-foreground border-b-2 border-primary/20 pb-0.5">
              Himanshu Tamoli
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
