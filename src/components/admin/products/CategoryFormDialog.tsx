import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import { Category } from "@/types";

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string;
  onCategoryCreated: (category: Category) => void;
};

export const CategoryFormDialog = ({
  open,
  onOpenChange,
  parentId,
  onCategoryCreated,
}: CategoryFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          onSuccess={(newCategory) => {
            onCategoryCreated(newCategory);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
