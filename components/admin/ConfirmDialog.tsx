"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export interface ConfirmOptions {
  title: string;
  description?: React.ReactNode;
  /** Label of the confirm button (default "Supprimer") */
  confirmLabel?: string;
  /** Red button + warning icon, for irreversible actions (default true) */
  destructive?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Styled replacement for window.confirm() in the admin.
 * Usage: `const confirm = useConfirm(); if (!(await confirm({ title: "…" }))) return;`
 */
export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return confirm;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  // Resolver of the pending confirm() promise; answered once, by a button or by closing the dialog
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    resolver.current?.(false);
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const answer = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOptions(null);
  };

  const destructive = options?.destructive ?? true;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog open={options !== null} onOpenChange={(open) => !open && answer(false)}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader className="sm:flex-row sm:items-start sm:gap-4 sm:space-y-0">
            {destructive && (
              <div className="mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            )}
            <div className="space-y-2 text-center sm:text-left">
              <AlertDialogTitle>{options?.title}</AlertDialogTitle>
              {options?.description && (
                <AlertDialogDescription asChild>
                  <div className="text-sm text-muted-foreground">{options.description}</div>
                </AlertDialogDescription>
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => answer(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => answer(true)}
              className={cn(destructive && "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600")}
            >
              {options?.confirmLabel ?? "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}
