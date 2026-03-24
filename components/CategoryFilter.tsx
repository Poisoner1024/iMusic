import { Category } from '@/types'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onSelect: (categoryId: string) => void
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            selectedCategory === category.id
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="text-lg">{category.icon}</span>
          <span>{category.name}</span>
          <span className="ml-1 rounded-full px-2 py-0.5 text-xs">
            {category.count}
          </span>
        </button>
      ))}
    </div>
  )
}
