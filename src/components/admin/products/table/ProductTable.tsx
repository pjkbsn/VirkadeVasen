import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types";

export const ProductTable = ({ products }: { products: Product[] }) => {
  console.log("Produkter: ", products);
  return (
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Namn</TableHead>
          <TableHead>Färg</TableHead>
          <TableHead>Antal</TableHead>
          <TableHead className="text-right">Pris</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products &&
          products.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.product_groups.name}
              </TableCell>
              <TableCell>{item.colors.name}</TableCell>
              <TableCell>{item.stock}</TableCell>
              <TableCell className="text-right">{item.price} kr</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
