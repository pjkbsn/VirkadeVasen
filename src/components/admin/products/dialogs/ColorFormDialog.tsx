// src/components/admin/products/ColorFormDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColorForm } from "../forms/ColorForm";
import { Color } from "@/types";

type ColorFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onColorCreated: (color: Color) => void;
};

export const ColorFormDialog = ({
  open,
  onOpenChange,
  onColorCreated,
}: ColorFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lägg till ny färg</DialogTitle>
        </DialogHeader>
        <ColorForm
          onSuccess={(newColor) => {
            onColorCreated(newColor);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
