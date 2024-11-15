export const metadata = {
    title: 'ShopTicket',
    description: 'Generated by Next.js',
  }
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="fr">
        <head>
            <title>{metadata.title}</title>
            <meta name="description" content={metadata.description} />
            <link rel="icon" href="/shopTicket.ico" />
        </head>
        <body>{children}</body>
      </html>
    )
  }
  