import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    category: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  };
  index: number;
}

const ProductCardWithQuantity: React.FC<ProductCardProps> = ({
  product,
  index,
}) => {
  return (
    <div className="group">
      <Link href={`/product/${product.id}`}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
          <div className="aspect-square overflow-hidden bg-gray-200">
            <Image
              src={product.image}
              alt={product.title}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2 capitalize">
              {product.category}
            </p>
            {/* <div className="flex items-center mb-3">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="mr-1 text-sm text-gray-600">
                  {product.rating.rate} ({product.rating.count} تقييم)
                </span>
              </div>
            </div> */}
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xl font-bold text-gray-900">
                {product.price} ر.س
              </span>

              {/* Static quantity controls */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-2 py-1 flex-row-reverse space-x-reverse">
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 h-8 w-8 flex items-center justify-center hover:bg-gray-200"
                >
                  <Minus size={14} />
                </Button>
                <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                  1
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 h-8 w-8 flex items-center justify-center hover:bg-gray-200"
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCardWithQuantity;
