import { Button } from "../ui/button";
import ProductItem from "./ProductItem";
import { ChevronRight, Flame } from "lucide-react";
import { getProducts } from "@/utils/baseData";
import TitleShow from "../TitleShow";

export default function ProductList() {
  const list = getProducts();
  return (
    <>
      <TitleShow title="Top-ranking products" titleStyle="text-red-600">
        <Flame className="mr-1" />
      </TitleShow>
      <div className="flex justify-between items-center flex-wrap">
        {(list || []).map((item, index) => {
          return <ProductItem key={index} {...item} />;
        })}
      </div>
      <div className="text-center my-4">
        <Button variant="link" className=" text-red-600">
          More
          <ChevronRight />
        </Button>
      </div>
    </>
  );
}
