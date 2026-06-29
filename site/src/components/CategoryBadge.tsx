interface Props {
  label: string
  color?: string
}

export default function CategoryBadge({label, color}: Props) {
  return (
    <span
      className="inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border border-current"
      style={color ? {color, borderColor: color} : undefined}
    >
      {label}
    </span>
  )
}
