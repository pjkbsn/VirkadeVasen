import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId: string;
};

export const CategoryFormDialog = ({
  open,
  onOpenChange,
  parentId,
}: CategoryFormDialogProps) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {parentId ? "Lägg till underkategori" : "Lägg till kategori"}
            </DialogTitle>
            <DialogDescription>
              Fyll i information för att lägga till en ny{" "}
              {parentId ? "underkategori" : "kategori"}
            </DialogDescription>
          </DialogHeader>

          <CategoryForm
            parentId={parentId}
            onSuccess={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
