import React from 'react';
import { CategoryName } from '../types';
import { CATEGORIES } from '../data/products';
import { Sparkles } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: CategoryName | 'All Items';
  onSelectCategory: (category: CategoryName | 'All Items') => void;
  productCounts: Record<string, number>;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  productCounts,
}) => {
  const totalCount = Object.values(productCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full bg-white border-b border-slate-200/80 sticky top-[69px] z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {/* All Items Pill */}
          <button
            type="button"
            onClick={() => onSelectCategory('All Items')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
              selectedCategory === 'All Items'
                ? 'bg-[#0f1111] text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>All Items</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedCategory === 'All Items'
                  ? 'bg-white/20 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* 6 Category Pills */}
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const count = productCounts[cat.name] || 0;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-[#ff9900] text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? 'bg-black/15 text-slate-950'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
