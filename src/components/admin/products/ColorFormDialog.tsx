import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColorForm } from "./ColorForm";

type ColorFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ColorFormDialog = ({
  open,
  onOpenChange,
}: ColorFormDialogProps) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lägg till ny färg</DialogTitle>
            <DialogDescription>Välj färg</DialogDescription>
          </DialogHeader>

          <ColorForm onSuccess={() => onOpenChange(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
