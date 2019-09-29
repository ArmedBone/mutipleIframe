'use strict'
const glob = require('glob');
const path = require('path')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const webpack = require('webpack')
const generate = require('@ant-design/colors/lib/generate').default
const pages = {}

glob.sync('./src/pages/**/app.js').forEach(path => {
 const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
  pages[chunk] = {
    entry: path,
    template: 'public/index.html',
    chunks: ['chunk-vendors', 'chunk-common', chunk]
  }

})
module.exports = {
  pages,
  chainWebpack: config => {
    //分包
    config.plugins.delete('named-chunks');
    config.optimization.splitChunks({
      chunks: 'all',// async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
      cacheGroups: {
        vendors: {
          test:/[\\/]node_modules[\\/]/,// 指定是node_modules下的第三方包
          name: 'chunk-vendors',
          minChunks: 5, // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
          chunks: "all",
          priority: 10   // 抽取优先级
        },
        // 抽离自定义工具库
        utilCommon: {
           name: 'chunk-common',
           //minSize: 1024, // 将引用模块分离成新代码文件的最小体积
           minChunks: 1, // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
           priority: 5,
          reuseExistingChunk: true
         }
      }
    })
  },
  transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
  productionSourceMap: false,//是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        data: `@import "@/assets/scss/color.scss";
                @import "@/assets/scss/basic.scss";
                 @import "@/assets/scss/variable.scss";
                @import "@/assets/scss/mixin.scss";`
      },
      less: {
        modifyVars: {
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px'
        },
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // TODO 需要增加根据环境不开启主题需求
      new ThemeColorReplacer({
        fileName: 'css/theme-colors-[contenthash:8].css',
        matchColors: getAntdSerials('#1890ff'), // 主色系列
        // 需要匹配的网站主题色
        resolveCss(resultCss) {
          return resultCss.replace(/#4b0/g, '#ed4040')
        },
        // 将匹配的颜色值替换
        externalCssFiles: [],
        // 改变样式选择器，解决样式覆盖问题
        changeSelector(selector) {
          switch (selector) {
            case '.ant-calendar-today .ant-calendar-date':
              return ':not(.ant-calendar-selected-date)' + selector
            case '.ant-btn:focus,.ant-btn:hover':
              return '.ant-btn:focus:not(.ant-btn-primary),.ant-btn:hover:not(.ant-btn-primary)'
            case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
              return null
            case '.ant-btn.active,.ant-btn:active':
              return '.ant-btn.active:not(.ant-btn-primary),.ant-btn:active:not(.ant-btn-primary)'
            case '.ant-menu-horizontal>.ant-menu-item-active,.ant-menu-horizontal>.ant-menu-item-open,.ant-menu-horizontal>.ant-menu-item-selected,.ant-menu-horizontal>.ant-menu-item:hover,.ant-menu-horizontal>.ant-menu-submenu-active,.ant-menu-horizontal>.ant-menu-submenu-open,.ant-menu-horizontal>.ant-menu-submenu-selected,.ant-menu-horizontal>.ant-menu-submenu:hover':
            case '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal > .ant-menu-submenu-selected,.ant-menu-horizontal > .ant-menu-submenu:hover':
              return '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover'
            default :
              return selector
          }
        }
      })
    ]
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}

function getAntdSerials(color) {
  // 淡化（即less的tint）
  const lightens = new Array(9).fill().map((t, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / 10)
  })
  const colorPalettes = generate(color)
  return lightens.concat(colorPalettes)
}
