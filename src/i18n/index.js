import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from 'element-ui/lib/locale/lang/zh-CN.js'
import en from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'en-GB',
  messages: {
    'en-GB':Object.assign(require('./lang/en'),en),
    'zh-CN':Object.assign(require('./lang/cn'),zh),
  }
})
