module.exports = {
  // ...other vue-cli plugin options...
  pwa: {
    name: 'HK Transport 香港交通',
    themeColor: '#3880ff',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',

    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW',
    iconPaths: {
      faviconSVG: 'assets/hk-transport.svg',
      favicon32: null,
      favicon16: null,
      appleTouchIcon: 'assets/icons/icon-192.webp',
      maskIcon: null,
      msTileImage: 'assets/icons/icon-192.webp'

    },
    manifestOptions:{
      name: 'HK Transport 香港交通',
      short_name: 'HK Transport',
      icons: [
        {
          "src": "assets/icons/icon-48.webp",
          "type": "image/png",
          "sizes": "48x48",
          "purpose": "any maskable"
        },
        {
          "src": "assets/icons/icon-72.webp",
          "type": "image/png",
          "sizes": "72x72",
          "purpose": "any maskable"
        },
        {
          "src": "assets/icons/icon-96.webp",
          "type": "image/png",
          "sizes": "96x96",
          "purpose": "any maskable"
        },
        {
          "src": "assets/icons/icon-128.webp",
          "type": "image/png",
          "sizes": "128x128",
          "purpose": "any maskable"
        },
        {
          "src": "assets/icons/icon-192.webp",
          "type": "image/png",
          "sizes": "192x192",
          "purpose": "any maskable"
        },
        {
          "src": "assets/icons/icon-256.webp",
          "type": "image/png",
          "sizes": "256x256",
          "purpose": "any maskable"
        },
        {
          "src": "assets/icons/icon-512.webp",
          "type": "image/png",
          "sizes": "512x512",
          "purpose": "any maskable"
        }
      ]
    }
  }
}
