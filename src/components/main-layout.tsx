import type { ReactNode } from "react";

interface MainLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function MainLayout({
  title,
  description,
  children,
}: MainLayoutProps) {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 w-full mx-auto">
      <div className="flex flex-col space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
