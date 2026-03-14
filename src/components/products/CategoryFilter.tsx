import React from 'react';
import { CATEGORIES } from '../../types';

interface CategoryFilterProps {
  value: string;
  onChange: (v: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {/* All pill */}
      <button
        onClick={() => onChange('')}
        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 whitespace-nowrap ${
          value === ''
            ? 'bg-[#f57314] text-white border-[#f57314] shadow-sm'
            : 'bg-white text-gray-600 border-gray-200 hover:border-[#f57314] hover:text-[#f57314]'
        }`}
      >
        🛒 All
      </button>

      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 whitespace-nowrap ${
            value === cat.value
              ? 'bg-[#f57314] text-white border-[#f57314] shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-[#f57314] hover:text-[#f57314]'
          }`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
