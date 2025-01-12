const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',               // <--- Add this line, it's the same as setting the baseUrl in vue.config.js
})
