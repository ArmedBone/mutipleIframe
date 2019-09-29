<template>
    <a-locale-provider :locale="locale">
        <div :class="wrapperClassName">
            <div :class="contentClassName">
                <slot></slot>
            </div>
        </div>

    </a-locale-provider>
</template>

<script>
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import en_GB from 'ant-design-vue/lib/locale-provider/en_GB';

  window.defaultLang = 'en-GB'
  export default {
    name: 'basicLayout',
    data() {
      return {
        locale:en_GB,
      }
    },
    props:{
      "type":{
        type: String,
        default:"basic"
      }
    },
    mounted(){
      var vm = this;
      //注册全局语言设置方法
      window.setGlobalLocale=function(lang) {
        console.log(lang)
        vm.$i18n.locale=lang=='zh-CN'?'zh-CN':'en-GB';
        vm.locale=lang=='zh-CN'?zh_CN:en_GB;
        console.log(vm.$i18n.locale)
      }
      //渲染后设置当前语言
      this.setLang();
    },
    computed:{
      wrapperClassName(){
        return this.type=='basic'?'page-wrapper':''
      },
      contentClassName(){
        return this.type=='basic'?'page-content':''
      }
    },
    methods:{
      setLang(){
        let lang=localStorage.getItem('lang');
        if(lang)window.setGlobalLocale(lang);
      }
    }
  }
</script>

<style scoped>

</style>
