interface FieldGroupProps {
  label: string
  children: React.ReactNode
  required?: boolean
}

export default function FieldGroup({ label, children, required }: FieldGroupProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  )
}
