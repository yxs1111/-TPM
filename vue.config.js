'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 8080 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: process.env.VUE_APP_BASE_PATH,
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: [
        'chunk-vendors',
        'chunk-commons',
        'chunk-libs',
        'chunk-elementUI',
        'runtime',
        'index',
      ],
    },
  },
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      '/Api': {
        target: `https://corpwechat-test.rfc-friso.com`,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/Api': '/Api',
        },
      },
      // '/profitAndLossReport': {
      //   target: `http://41p269262w.wicp.vip`,
      //   changeOrigin: true,
      //   secure: false,
      //   pathRewrite: {
      //     '^/profitAndLossReport': '/profitAndLossReport'
      //   }
      // },
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://192.168.40.227:7777`,  //梁刚
        //target: `http://192.168.30.32:7777`,  //现云
        //target: `http://192.168.30.35:7777`,  //泽圣
        //target: `http://192.168.40.69:7777`,  //宋佳
        //target: `http://192.168.40.155:7777`,  //宗桂
        // target: `http://10.176.80.242:7777`, // 测试服务器
        //target: `http://192.168.50.172:7788`, // 张淼
        // target: `http://192.168.50.85:7777`, // 王宝兴
        // target: `http://192.168.40.164:7777`, // 王宝兴
        //target: `http://192.168.40.170:7777`, // 樊鹏伟
        //target: `http://192.168.40.205:7777`, // 孙修为
        // target: `http://192.168.30.116:7777`, // 王文建
        target: `https://uat-iinvest.rfc-friso.com:8080/prod-api`, //测试服务器
        //target: `https://iInvest.rfc-friso.com/prod-api`,  //正式服务器
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '',
        },
        // timeout: 3600 * 1000
      },
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    externals: {
      './cptable': 'var cptable',
    },
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugins.delete('preload')

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config.when(process.env.NODE_ENV !== 'development', (cfg) => {
      cfg
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end()
      cfg.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      })
      cfg.optimization.runtimeChunk('single')
    })
  },
  runtimeCompiler: true,
}
