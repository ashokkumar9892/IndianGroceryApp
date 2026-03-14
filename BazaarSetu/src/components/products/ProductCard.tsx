import React from 'react';
import { ShoppingCart, Scale, CheckCircle, XCircle, Tag } from 'lucide-react';
import type { Product, StoreProduct } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { formatPrice, effectivePrice, formatWeight } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  storeProduct: StoreProduct;
  storeName: string;
  onCompare?: () => void;
  compareActive?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  storeProduct,
  storeName,
  onCompare,
  compareActive = false,
}) => {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);

  const inCart = items.some((i) => i.storeProductId === storeProduct.id);
  const effPrice = effectivePrice(storeProduct.price, storeProduct.discountPercent);
  const hasDiscount = !!storeProduct.discountPercent && storeProduct.discountPercent > 0;

  const handleAddToCart = () => {
    addItem({
      storeProductId: storeProduct.id,
      productId: product.id,
      storeId: storeProduct.storeId,
      productName: product.name,
      storeName,
      qty: 1,
      unitPrice: effPrice,
      emoji: product.emoji,
    });
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden group">
      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {storeProduct.discountPercent}% OFF
        </div>
      )}

      {/* Compare toggle */}
      {onCompare && (
        <button
          onClick={onCompare}
          title={compareActive ? 'Remove from compare' : 'Add to compare'}
          className={`absolute top-2 right-2 z-10 p-1.5 rounded-full border transition-all duration-150 text-sm ${
            compareActive
              ? 'bg-saffron-500 border-saffron-500 text-white shadow'
              : 'bg-white border-gray-200 text-gray-400 hover:border-saffron-400 hover:text-saffron-500'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Emoji */}
      <div className="flex items-center justify-center py-6 bg-gradient-to-b from-orange-50 to-amber-50">
        <span className="text-5xl select-none">{product.emoji}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        {/* Name & brand */}
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          {product.nameHindi && (
            <p className="text-xs text-gray-400 font-medium">{product.nameHindi}</p>
          )}
          <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>
        </div>

        {/* Weight */}
        <p className="text-xs text-gray-400">{formatWeight(product.weightValue, product.weightUnit)}</p>

        {/* Dietary badges */}
        <div className="flex flex-wrap gap-1">
          {product.isVegetarian && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">
              🟢 Veg
            </span>
          )}
          {product.isVegan && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full">
              🌿 Vegan
            </span>
          )}
          {product.isGlutenFree && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-full">
              GF
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold text-gray-900">{formatPrice(effPrice)}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(storeProduct.price)}</span>
          )}
        </div>

        {/* Stock badge */}
        <div className="flex items-center gap-1">
          {storeProduct.isAvailable && storeProduct.stockQty > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" />
              In Stock ({storeProduct.stockQty})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              <XCircle className="w-3 h-3" />
              Out of Stock
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!storeProduct.isAvailable || storeProduct.stockQty === 0}
          className={`mt-auto w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
            !storeProduct.isAvailable || storeProduct.stockQty === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : inCart
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-[#f57314] text-white hover:bg-orange-600 active:scale-95'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {inCart ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
