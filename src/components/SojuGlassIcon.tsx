interface Props {
  filled: boolean;
  className?: string;
}

export default function SojuGlassIcon({ filled, className }: Props) {
  return (
    <svg
      width="13"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 4 H20 L18 19 H6 Z" fill={filled ? 'currentColor' : 'none'} />
      <path d="M6 19 V21 H18 V19" />
    </svg>
  );
}
