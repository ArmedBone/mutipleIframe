<template>
    <a-list
        itemLayout="horizontal">
        <a-list-item >
            <a-list-item-meta>
                <div slot="title">{{$t('m.userSettings.theme')}}</div>
                <div slot="description" >
                    <div class="pull-left">
                        {{$t('m.userSettings.themeDesp')}}
                    </div>
                    <div class="pull-right">
                        <a-switch @change="setStyle" v-model="theme" :checkedChildren="$t('m.userSettings.dark')" :unCheckedChildren="$t('m.userSettings.light')" defaultChecked/>
                    </div>
                </div>
            </a-list-item-meta>
        </a-list-item>
        <a-list-item >
            <a-list-item-meta>
                <div slot="title">{{$t('m.userSettings.primary')}}</div>
                <div slot="description" >
                    <div class="pull-left">
                        {{$t('m.userSettings.primaryDesp')}}
                    </div>
                    <div class="pull-right">
                        <a-avatar
                                class="primary-color-item"
                                shape="square"
                                size="small"
                                v-for="color in colors"
                                :key="color"
                                :color="color"
                                @click="setPrimaryColor(color)"
                                :style="{backgroundColor:color, verticalAlign: 'middle',marginRight:'4px'}"></a-avatar>
                    </div>
                </div>
            </a-list-item-meta>
        </a-list-item>
    </a-list>
</template>

<script type="es6">
  export default {
    name: 'custom',
    data(){
      return{
        theme:true,
        colors:['#7265e6','#00a2ae','#1890ff','#FF9999','#339900','#FF99FF','#660099','#990066','#9966FF']
      }
    },
    mounted(){
      //从浏览器读取明/暗风格
      let theme = localStorage.getItem('theme');
      if(theme!=null)this.theme=theme=='true'?true:false;
    },
    methods:{
      setStyle(val){
        window.parent.setStyle(val);
      },
      setPrimaryColor(color){
        window.parent.setPrimaryColor(color);
      }
    }
  }
</script>

<style lang="scss">
  .primary-color-item{
      margin: 2px;
      box-sizing: border-box;
  }
.primary-color-item:hover{
   border: 2px solid $background ;
}
</style>
