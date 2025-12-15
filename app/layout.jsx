import './globals.css'

export const metadata = {
  title: 'ShopAI - Smart Shopping Assistant',
  description: 'AI-powered shopping search and recommendations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
