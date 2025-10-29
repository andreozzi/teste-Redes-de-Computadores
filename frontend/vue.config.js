const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 6363,
    proxy: {
      '/api': {
        target: 'http://localhost:6262',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      },
    },
  },
})

