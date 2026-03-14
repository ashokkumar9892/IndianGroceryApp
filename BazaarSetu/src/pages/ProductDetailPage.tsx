import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag } from 'lucide-react';
import { PRODUCTS } from '../data/mockProducts';
import { CATEGORIES } from '../types';
import { formatWeight } from '../utils/formatters';
import PriceCompareTable from '../components/compare/PriceCompareTable';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <span className="text-4xl mb-3">🔍</span>
        <h2 className="text-xl font-bold text-gray-700">Product not found</h2>
        <Link to="/stores" className="mt-4 text-[#f57314] hover:underline font-semibold">
          Browse Stores
        </Link>
      </div>
    );
  }

  const categoryMeta = CATEGORIES.find((c) => c.value === product.category);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-5">
          <Link to="/stores" className="hover:text-[#f57314] transition">Stores</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium truncate">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Product hero */}
          <div className="bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col items-center py-10 px-4">
            <span className="text-8xl select-none mb-2">{product.emoji}</span>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-extrabold text-gray-900">{product.name}</h1>
                {product.nameHindi && (
                  <p className="text-lg text-gray-400 font-medium">{product.nameHindi}</p>
                )}
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                {product.brand}
              </span>
              <span className="text-sm text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                {formatWeight(product.weightValue, product.weightUnit)}
              </span>
              {categoryMeta && (
                <span className="text-sm text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                  <span>{categoryMeta.emoji}</span>
                  {categoryMeta.label}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{product.description}</p>

            {/* Dietary badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isVegetarian && (
                <span className="inline-flex items-center gap-1 text-sm font-semibold bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
                  🟢 Vegetarian
                </span>
              )}
              {product.isVegan && (
                <span className="inline-flex items-center gap-1 text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                  🌿 Vegan
                </span>
              )}
              {product.isGlutenFree && (
                <span className="inline-flex items-center gap-1 text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">
                  ✓ Gluten Free
                </span>
              )}
              {!product.isVegan && !product.isVegetarian && (
                <span className="inline-flex items-center gap-1 text-sm font-semibold bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full">
                  🔴 Non-Vegetarian
                </span>
              )}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price compare table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Price Comparison</h2>
            <p className="text-sm text-gray-400 mt-0.5">Compare prices across all stores</p>
          </div>
          <div className="p-4">
            <PriceCompareTable productId={product.id} />
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6">
          <Link
            to="/stores"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#f57314] transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stores
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
