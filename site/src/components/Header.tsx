'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

const navItems = [
  {label: 'HOME', href: '/'},
  {label: 'REVIEWS', href: '/posts'},
  {label: 'MEMBERS', href: '/members'},
  {label: 'ABOUT', href: '/about'},
]

export default function Header() {
  const currentPath = usePathname()

  return (
    <header className="border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 md:py-8 text-center">
        <Link href="/" className="block">
          <h1 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-wide sm:tracking-widest uppercase leading-none hover:text-accent transition-colors duration-300">
            MONTHLY-AZESO
          </h1>
        </Link>
        <p className="text-xs tracking-[0.3em] text-gray-500 uppercase border-t border-b border-dashed border-gray-300 py-2 mt-4">
          MONTHLY-AZESO.COM
        </p>
      </div>
      <nav className="border-t-2 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ul className="flex justify-center gap-0">
            {navItems.map(({label, href}) => {
              const isActive =
                currentPath === href || (href !== '/' && currentPath.startsWith(href))
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      'block px-4 sm:px-8 py-3 text-xs font-bold tracking-widest uppercase transition-colors duration-200',
                      isActive
                        ? 'bg-black text-white'
                        : 'text-black hover:bg-black hover:text-white',
                    ].join(' ')}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </header>
  )
}
