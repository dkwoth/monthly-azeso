import Link from 'next/link'

const navItems = [
  {label: 'HOME', href: '/'},
  {label: 'REVIEWS', href: '/posts'},
  {label: 'MEMBERS', href: '/members'},
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">
              MONTHLY-AZESO
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">맛집 탐방 소모임 AZESO</p>
            <a
              href="https://instagram.com/monthly_azeso"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase border border-gray-400 px-3 py-2 text-gray-700 hover:border-black hover:text-black transition-colors duration-200"
            >
              IG &nbsp;@monthly_azeso
            </a>
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">
              NAVIGATE
            </p>
            <nav className="flex flex-col gap-2">
              {navItems.map(({label, href}) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm font-bold tracking-widest uppercase text-gray-700 hover:text-black transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-xs text-gray-500">© {year} MONTHLY-AZESO · All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}
