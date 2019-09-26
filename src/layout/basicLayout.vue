<template>
    <a-locale-provider :locale="zh_CN">
        <div class="page-wrapper">
            <div class="page-content">
        <slot></slot>
            </div>
        </div>
    </a-locale-provider>
</template>

<script>
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
/*  import moment from 'moment';
  import 'moment/locale/zh-cn';*/
  export default {
    name: 'basicLayout',
    data() {
      return {
        zh_CN,
      }
    }
  }
</script>

<style scoped>

</style>
