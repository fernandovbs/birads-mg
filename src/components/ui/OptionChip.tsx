interface OptionChipProps {
  label: string
  active: boolean
  onClick: () => void
  color?: 'default' | 'green' | 'yellow' | 'orange' | 'red'
}

const colorMap = {
  default: { active: 'border-blue-500 bg-blue-50 text-blue-700', inactive: 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50' },
  green:   { active: 'border-green-500 bg-green-50 text-green-700', inactive: 'border-gray-200 bg-white text-gray-600 hover:border-green-200 hover:bg-green-50' },
  yellow:  { active: 'border-yellow-500 bg-yellow-50 text-yellow-700', inactive: 'border-gray-200 bg-white text-gray-600 hover:border-yellow-200 hover:bg-yellow-50' },
  orange:  { active: 'border-orange-500 bg-orange-50 text-orange-700', inactive: 'border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50' },
  red:     { active: 'border-red-500 bg-red-50 text-red-700', inactive: 'border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50' },
}

export default function OptionChip({ label, active, onClick, color = 'default' }: OptionChipProps) {
  const c = colorMap[color]
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer border-2 transition-all select-none ${active ? c.active : c.inactive}`}
    >
      {active && <span className="mr-1.5 text-xs">✓</span>}
      {label}
    </button>
  )
}
