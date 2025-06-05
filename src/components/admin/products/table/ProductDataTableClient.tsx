"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Product, Color } from "@/types";

interface ProductDataTableClientProps {
  data: Product[];
  colors: Color[];
}

export function ProductDataTableClient({
  data,
  colors,
}: ProductDataTableClientProps) {
  return <DataTable columns={columns(colors)} data={data} />;
}
