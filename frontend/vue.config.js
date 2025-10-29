const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 6363,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://168.138.249.20:6262',
        changeOrigin: true,      },
    },
  },
})

