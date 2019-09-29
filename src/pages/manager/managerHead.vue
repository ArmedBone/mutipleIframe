<template>
    <section class="manager-head" >
        <a-icon type="menu-fold" :class="collapse?'menu-fold active':'menu-fold'" @click="menuFold" />
        <div class="pull-right clearfix">
            <!--<a-avatar size="small"  shape="square" style="backgroundColor:#87d068" ></a-avatar>-->
            <div class="pull-left">
                <a-select v-model="currentLang" @change="setLang">
                    <a-select-option value="zh-CN">zh-CN</a-select-option>
                    <a-select-option value="en-GB">en-GB</a-select-option>
                </a-select>
            </div>
           <div class="pull-left">
               <a-dropdown>
                   <div class="ant-dropdown-link" href="javascript:;">
                       <a-avatar size="small" class="user-head-icon" icon="user"></a-avatar>
                       <span style="margin-left: 4px">{{$t('m.manager.username')}}</span>
                   </div>
                   <a-menu slot="overlay">
                       <a-menu-item key="0">
                           <div @click="userSet">
                               <a-icon type="user" />
                               {{$t('m.manager.set')}}
                           </div>
                       </a-menu-item>
                       <a-menu-divider />
                       <a-menu-item key="1">
                          <div @click="safeExit">
                              <a-icon type="poweroff" />
                              {{$t('m.manager.exit')}}
                          </div>
                       </a-menu-item>
                   </a-menu>
               </a-dropdown>
           </div>
        </div>
    </section>
</template>

<script>
  export default {
    name: 'managerHead',
    data(){
      return{
        currentLang:window.defaultLang
      }
    },
    props:{
      "collapse":{
        type:Boolean
      }
    },
    created(){
      //设定语言选择框的值
      let lang=localStorage.getItem('lang')
     if(lang)this.currentLang=lang;
    },
    methods:{
      menuFold(){
        this.$emit("menu-fold")
      },
      userSet(){
        this.$emit("userSet")
      },
      //设置全局语言
      setLang(){
        let lang=this.currentLang;
        localStorage.setItem('lang',lang);
        //设置每个窗口语言
        window.setGlobalLocale(lang)
        var iframes = Array.prototype.slice.call(document.querySelectorAll('iframe'))
        iframes.forEach(it => {
          var win = it.contentWindow;
          if (win && win.changeColor) win.setGlobalLocale(lang);
        })
        //设置tabs标签的语言
        this.setAntTagsLang();
      },
      setAntTagsLang(){
        let self = this;
        let list = Array.prototype.slice.call(document.querySelectorAll('.ant-tag'));
        list.forEach(it=>{
          let t = it.getAttribute('title');
          it.querySelector('span').innerText=this.$t(t);
        })
      },
      safeExit(){
        this.$confirm({
          title: this.$t('m.manager.exitText'),
          cancelText:this.$t('m.common.cancel'),
          okText:this.$t('m.common.confirm'),
          onOk() {
            return new Promise((resolve, reject) => {
              window.location.assign('/')
            })
          },
          onCancel() {},
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
    .manager-head{
        height: 50px;
        line-height: 50px;
        box-sizing: border-box;
        border-bottom: 1px solid #e5e5e5;
        background-color: white;
    }
    .user-head-icon{
        background-color: $primary;
    }
    .menu-fold{
        font-size: 18px;
        padding: 10px 30px;
        transition: .3s;
        transform: scaleX(1);
    }
    .menu-fold.active{
        transform: scaleX(-1);
    }
    .ant-dropdown-link{
        padding: 0 10px;
        cursor: pointer;
        &:hover{
            color: #ffffff;
            background-color:darken($background,50);
        }
    }
</style>
