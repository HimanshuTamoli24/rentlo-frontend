import { PaintBucket } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

// The config object format saved in localStorage
export type ThemeConfig = {
  theme: "light" | "dark" | "system";
  primary: string;
  radius: number;
};

const DEFAULT_CONFIG: ThemeConfig = {
  theme: "light",
  // The default blue from index.css hsl(221.2 83.2% 53.3%) -> #2563eb
  // We actually need to map this back to HSL/OKLCH for index.css variables
  // but let's stick to HSL injection for simplicity or use CSS preset classes.
  // shadcn/ui typical format is HSL: "221.2 83.2% 53.3%"
  // Since we use OKLCH in index.css, we'll provide okLch values here.
  primary: "vibrant-blue", // Default is hardcoded vibrant-blue
  radius: 0.625, // Default is 0.625rem
};

export const THEMES = [
  { name: "light", label: "Light" },
  { name: "dark", label: "Dark" },
];

export const PRIMARY_COLORS = [
  { name: "vibrant-blue", label: "Blue", value: "oklch(0.5 0.2 250)" }, // Custom vivid blue
  { name: "rose", label: "Rose", value: "oklch(0.6 0.2 10)" },
  { name: "violet", label: "Violet", value: "oklch(0.55 0.2 300)" },
  { name: "emerald", label: "Emerald", value: "oklch(0.65 0.2 150)" },
  { name: "amber", label: "Amber", value: "oklch(0.7 0.2 70)" },
];

export const RADII = [0, 0.3, 0.5, 0.75, 1.0];

// Hook to read/write theme config
export function useThemeConfig() {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const stored = localStorage.getItem("rentlo-theme");
      return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  useEffect(() => {
    localStorage.setItem("rentlo-theme", JSON.stringify(config));
    applyThemeGlobally(config);
  }, [config]);

  return { config, setConfig };
}

// Function to apply config to DOM directly
export function applyThemeGlobally(config: ThemeConfig) {
  const root = document.documentElement;

  // 1. Apply Dark Mode
  if (config.theme === "dark") {
    root.classList.add("dark");
  } else if (config.theme === "light") {
    root.classList.remove("dark");
  } else {
    // System Theme handling if needed later, right now default to light
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (systemDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }

  // 2. Apply Radius
  root.style.setProperty("--radius", `${config.radius}rem`);

  // 3. Apply Primary Color (Only if not the default one where we want to use CSS normal values)
  if (config.primary === "vibrant-blue") {
    root.style.removeProperty("--primary");
    root.style.removeProperty("--primary-foreground"); // Default text OKLCH colors kick in
  } else {
    const colorObj = PRIMARY_COLORS.find((c) => c.name === config.primary);
    if (colorObj) {
      root.style.setProperty("--primary", colorObj.value);
      root.style.setProperty("--primary-foreground", "oklch(0.985 0 0)"); // White text usually for vivid cols
    }
  }
}

// The UI Dialog Component
export function ThemeSettingsDialog({
  children,
  open,
  onOpenChange,
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { config, setConfig } = useThemeConfig();
  const [darkButtonPos, setDarkButtonPos] = useState({ x: 0, y: 0 });

  const handleDarkHover = () => {
    // Generate random position offsets
    const rx = (Math.random() - 0.5) * 150;
    const ry = (Math.random() - 0.5) * 150;
    setDarkButtonPos({ x: rx, y: ry });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PaintBucket className="h-5 w-5" />
            Appearance Settings
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex justify-between">
              <span>Mode</span>
              <span className="text-primary capitalize">{config.theme}</span>
            </Label>
            <p className="text-xs text-muted-foreground italic mb-2">
              Please don't select dark mode 👀
            </p>
            <div className="flex flex-wrap gap-2 relative">
              {THEMES.map((theme) => {
                if (theme.name === "dark") {
                  return (
                    <Button
                      key={theme.name}
                      variant={
                        config.theme === theme.name ? "default" : "outline"
                      }
                      className="w-24 capitalize absolute transition-all duration-200 ease-out z-10"
                      style={{
                        transform: `translate(${darkButtonPos.x}px, ${darkButtonPos.y}px)`,
                        left: "104px", // Position it after Light button roughly
                      }}
                      onMouseEnter={handleDarkHover}
                      onClick={handleDarkHover}
                    >
                      {theme.label}
                    </Button>
                  );
                }
                return (
                  <Button
                    key={theme.name}
                    variant={
                      config.theme === theme.name ? "default" : "outline"
                    }
                    className="w-24 capitalize"
                    onClick={() =>
                      setConfig({ ...config, theme: theme.name as any })
                    }
                  >
                    {theme.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex justify-between">
              <span>Primary Color</span>
              <span className="text-primary capitalize">
                {config.primary.replace("-", " ")}
              </span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {PRIMARY_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setConfig({ ...config, primary: color.name })}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all hover:scale-110 ${
                    config.primary === color.name
                      ? "border-primary scale-110 shadow-md"
                      : "border-transparent shadow-sm"
                  }`}
                  style={{
                    backgroundColor:
                      color.name === "vibrant-blue" ? "#2563eb" : color.value,
                  }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex justify-between">
              <span>Radius (Border)</span>
              <span className="text-primary">{config.radius}rem</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {RADII.map((r) => (
                <Button
                  key={r}
                  variant={config.radius === r ? "default" : "outline"}
                  onClick={() => setConfig({ ...config, radius: r })}
                  className="w-16"
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={() => {
                setConfig(DEFAULT_CONFIG);
                setDarkButtonPos({ x: 0, y: 0 });
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
