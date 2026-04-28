import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Trillo board',
  description: 'Organize anything, together. Trillo is a collaboration tool that organizes your projects into boards. In one glance, know what\'s being worked on, who\'s working on what, and where something is in a process.',
  icons: {
    icon: '/images/favicon/web-app-manifest-192x192.png',
    apple: '/images/favicon/web-app-manifest-192x192.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            if (localStorage.getItem('darkMode') === 'true')
              document.documentElement.classList.add('dark');
          } catch(e) {}
        `}} />
      </head>
      <body className={inter.className}>
        <div className="layout">{children}</div>
      </body>
    </html>
  )
}
