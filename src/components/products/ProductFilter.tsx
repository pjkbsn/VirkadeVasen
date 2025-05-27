"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FilterCheckbox } from "@/components/common/FilterCheckbox";
import { Category, Color } from "@/types";
import { useEffect, useState } from "react";

export type FilterState = {
  colors: string[];
  categories: string[];
  prices: string[];
};

type ProductFilterProps = {
  colors: Color[];
  categories: Category[];
  onFilterChange?: (filters: FilterState) => void;
};

export const ProductFilter = ({
  colors,
  categories,
  onFilterChange,
}: ProductFilterProps) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    colors: [],
    categories: [],
    prices: [],
  });

  useEffect(() => {
    // Call the parent callback if provided
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  }, [selectedFilters, onFilterChange]);

  const handleFilterChange = (
    type: keyof FilterState,
    value: string,
    isChecked: boolean
  ) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };

      if (type === "prices") {
        if (isChecked) {
          newFilters.prices = [value];
        } else {
          newFilters.prices = [];
        }
      } else {
        if (isChecked) {
          newFilters[type] = [...prev[type], value];
        } else {
          newFilters[type] = prev[type].filter((item) => item !== value);
        }
      }
      return newFilters;
    });
  };

  return (
    <>
      <Accordion
        type="multiple"
        defaultValue={["item-1", "item-2", "item-3", "item-4"]}
      >
        {/* <AccordionItem value="item-1">
          <AccordionTrigger>Färger</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {colors.map((color) => (
              <FilterCheckbox
                key={color.id}
                id={color.name}
                labelText={color.name}
                onChange={(isChecked) =>
                  handleFilterChange("colors", color.id, isChecked)
                }
                checked={selectedFilters.colors.includes(color.id)}
              />
            ))}
          </AccordionContent>
        </AccordionItem> */}
        <AccordionItem value="item-2">
          <AccordionTrigger className="cursor-pointer">
            Kategori
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {categories.map((category) => (
              <FilterCheckbox
                key={category.id}
                id={category.name}
                labelText={category.name}
                onChange={(isChecked) =>
                  handleFilterChange("categories", category.id, isChecked)
                }
                checked={selectedFilters.categories.includes(category.id)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="cursor-pointer">Pris</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <FilterCheckbox
              id="200"
              labelText="<200 kr"
              onChange={(isChecked) =>
                handleFilterChange("prices", "200", isChecked)
              }
              checked={selectedFilters.prices.includes("200")}
            />
            <FilterCheckbox
              id="400"
              labelText="<400 kr"
              onChange={(isChecked) =>
                handleFilterChange("prices", "400", isChecked)
              }
              checked={selectedFilters.prices.includes("400")}
            />
            <FilterCheckbox
              id="600"
              labelText="<600 kr"
              onChange={(isChecked) =>
                handleFilterChange("prices", "600", isChecked)
              }
              checked={selectedFilters.prices.includes("600")}
            />
          </AccordionContent>
        </AccordionItem>
        {/* <AccordionItem value="item-4">
          <AccordionTrigger>Storlek</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <FilterCheckbox id="small" labelText="10x15" />
            <FilterCheckbox id="medium" labelText="20x30" />
            <FilterCheckbox id="large" labelText="30x40" />
          </AccordionContent>
        </AccordionItem> */}
      </Accordion>
    </>
  );
};
