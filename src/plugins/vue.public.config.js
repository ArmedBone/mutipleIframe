import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './axios'
import {changeColor} from '../utils/color'

import BasicLayout from '@/layout/basicLayout';

export default function(App) {
  //注册修改主题颜色方法到window
  window.changeColor = changeColor
  let primaryColor = localStorage.getItem('primaryColor');
  //修改主题方法
  window.changeColor(primaryColor?primaryColor:'#1890ff');

  Vue.use(Antd);

  Vue.component('basicLayout',BasicLayout);

  setTimeout(function() {
    new Vue({
      el: '#app',
      render: h => h(App)
    })
  }, 0)
}

