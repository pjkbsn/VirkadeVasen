import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FilterCheckbox } from "@/components/common/FilterCheckbox";

export const ProductFilter = () => {
  return (
    <>
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Färger</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <FilterCheckbox id="black" labelText="Svart" />
            <FilterCheckbox id="white" labelText="Vit" />
            <FilterCheckbox id="green" labelText="Grön" />
            <FilterCheckbox id="pink" labelText="Rosa" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Kategori</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <FilterCheckbox id="mythical" labelText="Mytiska" />
            <FilterCheckbox id="water" labelText="Vatten" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Pris</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <FilterCheckbox id="200" labelText="<200" />
            <FilterCheckbox id="400" labelText="<400" />
            <FilterCheckbox id="600" labelText="<600" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Storlek</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <FilterCheckbox id="small" labelText="10x15" />
            <FilterCheckbox id="medium" labelText="20x30" />
            <FilterCheckbox id="large" labelText="30x40" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
