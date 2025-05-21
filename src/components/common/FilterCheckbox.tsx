import { Checkbox } from "@/components/ui/checkbox";

type FilterCheckboxProps = {
  id: string;
  labelText: string;
  onChange?: (checked: boolean) => void;
  checked: boolean;
};

export const FilterCheckbox = ({
  id,
  labelText,
  onChange,
  checked,
}: FilterCheckboxProps) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="cursor-pointer"
      />
      <label htmlFor={id}>{labelText}</label>
    </div>
  );
};
