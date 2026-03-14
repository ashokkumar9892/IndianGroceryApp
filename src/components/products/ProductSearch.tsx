import React from 'react';
import { Search, X } from 'lucide-react';

interface ProductSearchProps {
  value: string;
  onChange: (v: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products, brands…"
        className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f57314]/40 focus:border-[#f57314] transition"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ProductSearch;
