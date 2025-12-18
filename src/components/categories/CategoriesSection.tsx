import { Button } from "../ui/button";
import CategoriesSelect from "./CategoriesSelect";

export default function CategoriesSection() {
  return (
    <div className="flex items-center gap-3 mt-4">
      <CategoriesSelect />
      <Button variant="outline">Add Category</Button>
    </div>
  );
}
