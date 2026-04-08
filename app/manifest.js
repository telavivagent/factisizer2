export default function manifest() {
  return {
    name:             'Factisizer',
    short_name:       'Factisizer',
    description:      'Check facts instantly. Powered by AI.',
    start_url:        '/',
    display:          'standalone',
    background_color: '#fcf9f8',
    theme_color:      '#605f5f',
    orientation:      'any',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  };
}
