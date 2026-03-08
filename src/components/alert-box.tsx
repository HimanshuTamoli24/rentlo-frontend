import { useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Trash2,
  Pencil,
  PlusCircle,
  AlertTriangle,
  CircleHelp,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ConfirmVariant = "create" | "update" | "delete" | "warning";

type ConfirmOptions = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
};

let openConfirmRef: ((options: ConfirmOptions) => Promise<boolean>) | null =
  null;

interface ConfirmFn {
  (options: ConfirmOptions): Promise<boolean>;
  create: (opts: Omit<ConfirmOptions, "variant">) => Promise<boolean>;
  update: (opts: Omit<ConfirmOptions, "variant">) => Promise<boolean>;
  delete: (opts: Omit<ConfirmOptions, "variant">) => Promise<boolean>;
  warning: (opts: Omit<ConfirmOptions, "variant">) => Promise<boolean>;
}

const confirmFn = ((options: ConfirmOptions) => {
  if (!openConfirmRef) {
    throw new Error(
      "ConfirmDialog component not mounted. Please add <ConfirmDialog /> in your App root.",
    );
  }
  return openConfirmRef(options);
}) as ConfirmFn;

confirmFn.create = (opts: Omit<ConfirmOptions, "variant">) =>
  confirmFn({ ...opts, variant: "create" });
confirmFn.update = (opts: Omit<ConfirmOptions, "variant">) =>
  confirmFn({ ...opts, variant: "update" });
confirmFn.delete = (opts: Omit<ConfirmOptions, "variant">) =>
  confirmFn({ ...opts, variant: "delete" });
confirmFn.warning = (opts: Omit<ConfirmOptions, "variant">) =>
  confirmFn({ ...opts, variant: "warning" });

export const confirm = confirmFn;

const VARIANT_CONFIG: Record<
  ConfirmVariant,
  {
    title: string;
    message: string;
    icon: ReactNode;
    actionClass: string;
  }
> = {
  create: {
    title: "Create item",
    message: "Are you sure you want to create this item?",
    icon: <PlusCircle className="w-6 h-6 text-green-600" />,
    actionClass: "bg-green-600 hover:bg-green-700 text-white",
  },
  update: {
    title: "Update item",
    message: "Are you sure you want to update this item?",
    icon: <Pencil className="w-6 h-6 text-primary" />,
    actionClass: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
  delete: {
    title: "Delete item",
    message: "Are you sure you want to delete this item?",
    icon: <Trash2 className="w-6 h-6 text-destructive" />,
    actionClass:
      "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  },
  warning: {
    title: "Warning",
    message: "Please confirm this action.",
    icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
    actionClass: "bg-yellow-500 hover:bg-yellow-600 text-white",
  },
};

export function ConfirmDialog({ children }: { children?: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openConfirm = useCallback((options: ConfirmOptions) => {
    setOptions(options);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleClose = (result: boolean) => {
    resolver?.(result);
    setIsOpen(false);
  };

  // Prevent flicker by clearing after animation finishes
  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setOptions(null);
        setResolver(null);
      }, 150); // 150ms ≈ AlertDialog exit animation
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    openConfirmRef = openConfirm;
    return () => {
      openConfirmRef = null;
    };
  }, [openConfirm]);

  const variant = options?.variant || "warning";
  const config = VARIANT_CONFIG[variant];

  const title = options?.title || config.title;
  const message = options?.message || config.message;
  const confirmText = options?.confirmText || "Confirm";
  const cancelText = options?.cancelText || "Cancel";

  return (
    <>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mb-2">
              {config.icon || (
                <CircleHelp className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {cancelText && (
              <AlertDialogCancel onClick={() => handleClose(false)}>
                {cancelText}
              </AlertDialogCancel>
            )}
            <AlertDialogAction
              onClick={() => handleClose(true)}
              className={cn(config.actionClass)}
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
