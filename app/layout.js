import './globals.css'

export const metadata = {
  title: { default: 'SALON POKE BY VIVA | 爆毛術脫髮護理', template: '%s | SALON POKE BY VIVA' },
  description: '超過20年專業經驗，專精剪髮、染髮、電髮及頭髮修護。亞洲人髮絲專家，香港市中心工作室。',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://salonpokeviva.com'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-HK">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
