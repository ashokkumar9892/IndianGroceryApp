import React from 'react';
import { PackageSearch } from 'lucide-react';
import type { Product, StoreProduct } from '../../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  storeProducts: StoreProduct[];
  storeId: string;
  storeName: string;
  compareList: string[];
  onCompare: (productId: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  storeProducts,
  storeName,
  compareList,
  onCompare,
}) => {
  // Build a quick lookup map: productId -> StoreProduct
  const spMap = new Map<string, StoreProduct>(
    storeProducts.map((sp) => [sp.productId, sp])
  );

  // Only render products that have a storeProduct entry for this store
  const renderable = products.filter((p) => spMap.has(p.id));

  if (renderable.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageSearch className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-500 mb-1">No products found</h3>
        <p className="text-sm text-gray-400">
          Try adjusting your search or selecting a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {renderable.map((product) => {
        const sp = spMap.get(product.id)!;
        const isInCompare = compareList.includes(product.id);
        return (
          <ProductCard
            key={sp.id}
            product={product}
            storeProduct={sp}
            storeName={storeName}
            compareActive={isInCompare}
            onCompare={() => onCompare(product.id)}
          />
        );
      })}
    </div>
  );
};

export default ProductGrid;
