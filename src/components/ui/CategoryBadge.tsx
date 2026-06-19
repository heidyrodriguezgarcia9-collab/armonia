import { CATEGORY_COLORS } from '../../utils/constants'
import type { Category } from '../../types'

interface CategoryBadgeProps {
  category: Category
  dotOnly?: boolean
}

export function CategoryBadge({ category, dotOnly }: CategoryBadgeProps) {
  const colors = CATEGORY_COLORS[category.color]
  if (!colors) return null

  if (dotOnly) {
    return (
      <span
        className={`inline-block w-2 h-2 rounded-full ${colors.dot}`}
        title={category.name}
      />
    )
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {category.name}
    </span>
  )
}
