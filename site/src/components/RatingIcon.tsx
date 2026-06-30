import SojuGlassIcon from './SojuGlassIcon'

interface Props {
  rating: number
  max?: number
  width?: number
  height?: number
}

export default function RatingIcon({rating, max = 3, width, height}: Props) {
  return (
    <span className="inline-flex gap-1" aria-label={`평점 ${rating}/${max}`}>
      {Array.from({length: max}, (_, i) => (
        <SojuGlassIcon
          key={i}
          filled={i < rating}
          width={width}
          height={height}
          className={i < rating ? 'text-accent' : 'text-gray-300'}
        />
      ))}
    </span>
  )
}
