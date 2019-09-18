<template>
    <section>
        <div class="manager-tabs">
            <div class="manager-tabs-prev" @click="prevOffset">
                <a-icon type="left"></a-icon>
            </div>
            <div class="manager-tabs-content">
                <div class="manager-tabs-content-items" :style="{'width':contentWidth+'px','left':-offsetLeft+'px'}">
                   <div v-for="(it,index) in iframeList" @click="tabItemClick(it,index)" :key="it.target" class="manager-tabs-content-item">
                       <a-tag :color="index == activeIndex?'blue':''" :target="it.target" @click.self="it=>void 0" @close.stop="removeTabItem(it.target,index)"  closable >{{it.title}}</a-tag>
                   </div>
                </div>
            </div>
            <div @click="nextOffset" class="manager-tabs-next">
                <a-icon type="right"></a-icon>
            </div>
            <div class="manager-tabs-operations">
                操作{{activeIndex}},{{offsetIndex}},{{iframeList.length}}
            </div>
            <div class="tabs-item"></div>
        </div>
        <div class="content-wrapper">
            <iframe
                    v-for="(it,index) in iframeList"
                    v-show="index == activeIndex"
                    :src="it.target"
                    frameborder="0"
                    class="content-iframe"></iframe>
        </div>
    </section>
</template>

<script>
  export default {
    name: 'managerTabs',
    data(){
      return{
        contentWidth:0,
        offsetIndex:0,
        offsetLeft:0,
        timer:null
      }
    },
    props:{
      "iframeList":{
        type:Array
      },
      "activeIndex":{
        type:Number
      }
    },
    watch:{
      iframeList(nv){
       if(nv.length-this.offsetIndex<=0)this.offsetIndex=nv.length-1;
        let self = this
        clearTimeout(this.timer);
        this.timer=setTimeout(function() {
          self.$nextTick(function() {
            let items = document.querySelectorAll('.manager-tabs-content-item');
            self.contentWidth = Array.prototype.reduce.call(items,function(p,v,i) {
              return p+Math.ceil(v.offsetWidth);
            },0);
          })
        },0)

      },
      offsetIndex(nv){
        let items = document.querySelectorAll('.manager-tabs-content-item');
        let domList = Array.prototype.slice.call( items,0,nv);
        this.offsetLeft = domList.reduce(function(p,v,i) {
          return p+v.offsetWidth;
        },0);
        console.log(this.offsetLeft)
      },
      activeIndex(nv){
        if(nv-this.offsetIndex>4) this.offsetIndex=nv;

      }
    },
    computed:{

    },
    methods:{
      removeTabItem(target,index){
        this.$emit("removeTabItem",target,index);
      },
      prevOffset(){
        if(this.iframeList.length-this.offsetIndex>4)this.offsetIndex +=4;
      },
      nextOffset(){
        this.offsetIndex>4?this.offsetIndex -=4:this.offsetIndex=0;
      },
      tabItemClick(it,index){
        this.$emit("tabItemClick",it,index)
      }
    }
  }
</script>

<style lang="scss" scoped>
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
    }
</style>
