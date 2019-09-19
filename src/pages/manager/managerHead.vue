<template>
    <section class="manager-head" >
        <a-icon type="menu-fold" :class="collapse?'menu-fold active':'menu-fold'" @click="menuFold" />
        <div class="pull-right clearfix">
            <!--<a-avatar size="small"  shape="square" style="backgroundColor:#87d068" ></a-avatar>-->

           <div class="pull-left">
               <a-dropdown>
                   <div class="ant-dropdown-link" href="javascript:;">
                       <a-avatar size="small" class="user-head-icon" icon="user"></a-avatar>
                       <span style="margin-left: 4px">杰哥哥</span>
                   </div>
                   <a-menu slot="overlay">
                       <a-menu-item key="0">
                           <div @click="userSet">
                               <a-icon type="user" />
                               账户设置
                           </div>
                       </a-menu-item>
                       <a-menu-divider />
                       <a-menu-item key="1">
                          <div @click="safeExit">
                              <a-icon type="poweroff" />
                              安全退出
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
    props:{
      "collapse":{
        type:Boolean
      }
    },
    methods:{
      menuFold(){
        this.$emit("menu-fold")
      },
      userSet(){
        this.$emit("userSet")
      },
      safeExit(){
        this.$confirm({
          title: '此操作将退出管理平台！',
          cancelText:"取消",
          okText:"确定",
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
