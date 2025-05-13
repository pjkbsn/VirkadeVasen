import { Checkbox } from "@/components/ui/checkbox";

type FilterCheckboxProps = {
  id: string;
  labelText: string;
};

export const FilterCheckbox = ({ id, labelText }: FilterCheckboxProps) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} className="cursor-pointer" />
      <label htmlFor={id}>{labelText}</label>
    </div>
  );
};
