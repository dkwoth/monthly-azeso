/** "YYYY-MM-DD" → "2026년 2월 11일" (타임존 드리프트 없이) */
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map((n) => parseInt(n, 10))
  if (!y || !m || !d) return date
  return `${y}년 ${m}월 ${d}일`
}
