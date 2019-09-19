<template>
    <section>
        <div class="manager-tabs">
            <div ref="prevButton" class="manager-tabs-prev" >
                <a-icon type="left"></a-icon>
            </div>
            <div class="manager-tabs-content">
                <div ref="tabsContent" class="manager-tabs-content-items">
                </div>
            </div>
            <div ref="nextButton"  class="manager-tabs-next">
                <a-icon type="right"></a-icon>
            </div>
            <div class="manager-tabs-operations">
                <a-dropdown>
                   <div>
                       操作
                   </div>
                    <a-menu slot="overlay">
                        <a-menu-item>
                           <div @click="backCurrent">回到当前标签</div>
                        </a-menu-item>
                        <a-menu-item>
                            <div @click="removeSiblings">关闭其他标签</div>
                        </a-menu-item>
                        <a-menu-item @click="removeAllTags">
                           <div>关闭所有标签</div>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </div>
            <div class="tabs-item"></div>
        </div>
        <div ref="contentWrapper" class="content-wrapper">
        </div>
    </section>
</template>

<script>
  export default {
    name: 'managerTabs',
    methods: {
      //回到当前标签页
      backCurrent() {
        let tags = this.$refs.tabsContent.querySelectorAll('.ant-tag');
        let activeIndex=-1;
        tags.forEach((it,i)=>{
          if(it.classList.contains('ant-tag-blue')){
            activeIndex=i;
            return void 0;
          }
        })
        this.$emit('backCurrent',activeIndex);
      },
      //关闭当前标签
      removeSiblings(){
        this.$emit("removeSiblings");
      },
      //关闭所有标签
      removeAllTags(){
        this.$emit("removeAllTags");
      },

    }
  }
</script>

<style lang="scss">
    .manager-tabs-btn{
        height: 40px;
        line-height: 40px;
        text-align: center;
        float: left;
        box-sizing: border-box;
        background-color: white;
        color: $content;
        cursor: pointer;
    }
    .manager-tabs{
        height: 40px;
        box-sizing: border-box;
        background-color: white;
        box-shadow: 0 2px 2px rgba(0,0,0,0.2);
        position: relative;
        z-index: 100;
        &-prev,&-next{
            @extend .manager-tabs-btn;
            width: 30px;
            border-right: 1px solid #e5e5e5;
        }
        &-operations{
            @extend .manager-tabs-btn;
            width: 80px;
        }
        &-prev:hover,&-next:hover,&-operations:hover{
            background-color:darken($background,50);
            color: white;
        }
        &-prev>i,&-next>i{
            vertical-align: middle;
        }
        &-content{
            width: calc(100% - 140px);
            height: 40px;
            float: left;
            position: relative;
            overflow: hidden;
            border-right: 1px solid #e5e5e5;
            &-items{
                position: absolute;
                top: 0;
                height: 40px;
                line-height: 40px;
                transition: .3s;
                white-space: nowrap;
            }
            &-item{
                box-sizing: border-box;
                padding-left: 4px;
                display: inline-block;
                overflow: hidden;
            }
            &-item>.ant-tag{
                margin: 0;
            }
        }
    }
    .content-wrapper{
        position: relative;
    }
    .content-iframe{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100vh - 90px);
        background: $background;
        display: none;
        &.active{
            display: block;
        }
    }
</style>
