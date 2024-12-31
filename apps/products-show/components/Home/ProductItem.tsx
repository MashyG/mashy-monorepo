import { type ProductItem } from "@/utils/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function ProductItem(props: ProductItem) {
  const { name, beforePrice, price, image, desc } = props;
  return (
    <div className="w-[30%] mb-4">
      <Image
        src={image}
        alt={name}
        width={250}
        height={250}
        className="w-full rounded"
      />
      <div className="mb-2">
        <div className="flex justify-between items-center my-1 text-lg">
          <p>{name}</p>
          <p className="text-red-600">
            <del className="mr-1 text-xs text-gray-500">{beforePrice}</del>
            {price}
          </p>
        </div>
        <p className="text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
          {desc}
        </p>
      </div>
      <div className="text-center">
        <Button variant="secondary">
          <ShoppingCart />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
