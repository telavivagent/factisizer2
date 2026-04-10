import './globals.css';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata = {
  title: 'Factisizer — Check Facts Instantly',
  description:
    'A minimal, premium A judge in your pocket. Type a claim, ask a question, or paste an article URL.',
  metadataBase: new URL('https://factisizer.com'),
  applicationName: 'Factisizer',
  keywords: ['fact check', 'AI', 'misinformation', 'truth', 'Marathi'],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Factisizer',
  },
  formatDetection: { telephone: false },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#605f5f',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Factisizer" />
      </head>
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}