const SOJU_GLASS_PATHS = {
  glass: 'M4 4 H20 L18 19 H6 Z',
  base: 'M6 19 V21 H18 V19',
} as const

interface Props {
  filled: boolean
  className?: string
  width?: number
  height?: number
}

export default function SojuGlassIcon({filled, className, width = 13, height = 14}: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={['block', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <path d={SOJU_GLASS_PATHS.glass} fill={filled ? 'currentColor' : 'none'} />
      <path d={SOJU_GLASS_PATHS.base} />
    </svg>
  )
}
