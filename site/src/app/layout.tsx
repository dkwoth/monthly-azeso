import type {Metadata} from 'next'
import './globals.css'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'MONTHLY-AZESO',
    template: '%s | MONTHLY-AZESO',
  },
  description: '맛집 탐방 소모임 AZESO의 방문 기록',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="bg-white text-gray-900 font-sans">
        {children}
        <Footer />
      </body>
    </html>
  )
}
