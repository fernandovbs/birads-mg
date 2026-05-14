interface SectionCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export default function SectionCard({ title, subtitle, children, className = '' }: SectionCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
