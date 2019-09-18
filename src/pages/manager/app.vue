<template>
    <section class="manager">
        <div :class="collapse?'side-menu active':'side-menu'"
             :style="{'background-color':theme?'#0c142d':'white'}">
            <div :class="theme?'sitename dark':'sitename light'">
                运营管理平台
            </div>
            <a-menu
                    mode="inline"
                    :theme="theme?'dark':'light'"
                    @click="handleMenuClick"
                    :inlineCollapsed="collapse">
                <a-menu-item
                        v-for="level_01 in sourceMenu"
                        v-if="!level_01.children"
                        :target="level_01.resourceValue"
                        :title="level_01.resourceName"
                        :key="level_01.id">
                    <a-icon type="pie-chart"/>
                    <span>{{level_01.resourceName}}</span>
                </a-menu-item>
                <a-sub-menu
                        v-for="level_01 in sourceMenu"
                        v-if="level_01.children && level_01.children.length!=0"
                        :key="level_01.id">
                    <span slot="title"><a-icon type="mail"/><span>{{level_01.resourceName}}</span></span>
                    <a-menu-item
                            v-for="level_02 in level_01.children"
                            v-if="!level_02.children "
                            :target="level_02.resourceValue"
                            :title="level_02.resourceName"
                            :key="level_02.id">
                        <span>{{level_02.resourceName}}</span>
                    </a-menu-item>
                    <a-sub-menu
                            v-for="level_02 in level_01.children"
                            v-if="level_02.children && level_02.children.length!=0"
                            :key="level_02.id">
                        <span slot="title">{{level_02.resourceName}}</span>
                        <a-menu-item
                                v-for="level_03 in level_02.children"
                                v-if="!level_03.children "
                                :target="level_03.resourceValue"
                                :title="level_03.resourceName"
                                :key="level_03.id">
                            <span>{{level_03.resourceName}}</span>
                        </a-menu-item>
                    </a-sub-menu>
                </a-sub-menu>
            </a-menu>
        </div>
        <div :class="collapse?'manager-content active':'manager-content'">
            <manager-head @userSet="userSet" @menu-fold="menuFold" :collapse="collapse"></manager-head>
            <manager-tabs
                    :activeIndex="activeIndex"
                    :iframeList="iframeList"
                    @tabItemClick="tabItemClick"
                    @removeTabItem="removeTabItem"></manager-tabs>
        </div>

    </section>
</template>
<script type="es6">
  import ManagerHead from './managerHead'
  import ManagerTabs from './managerTabs'

  export default {
    data() {
      return {
        collapse: false,
        activeName: 'second',
        sourceMenu: [],
        iframeList: [],
        activeIndex: -1,
        theme: true
      }
    },
    components: {
      'managerHead': ManagerHead,
      'managerTabs': ManagerTabs
    },
    created() {
      this.getMenu()
    },
    mounted() {
      var self = this
      //设置明暗风格
      window.setStyle = function(val) {
        self.theme = val
      }
      //设置主题颜色
      window.setPrimaryColor = function(color) {
        self.setPrimaryColor(color)
      }
    },
    methods: {
      //修改窗口的主题颜色
      setPrimaryColor(color) {
        localStorage.setItem('primaryColor',color);
        window.changeColor(color)
        var iframes = Array.prototype.slice.call(document.querySelectorAll('iframe'))
        iframes.forEach(it => {
          var win = it.contentWindow
          if (win && win.changeColor) win.changeColor(color)
        })
      },
      menuFold() {
        this.collapse = !this.collapse
      },
      userSet() {
        var li = document.createElement('li')
        li.setAttribute('target', '/system/userSet.html')
        li.setAttribute('title', '账户设置')
        this.handleMenuClick({ item: { $el: li } })
      },
      async getMenu() {
        var data = await this.$axios({
          url: '/main/menu',
          method: 'post',
          params: { 'systemId': '01' }
        })
        if (data.key == '0000') {
          this.sourceMenu = this.parseTree(data.data.menu)
        }
      },
      parseTree(all) {
        var MENU_DATA = []
        all = Array.prototype.sort.call(all, (a, b) => {
          return a.orderId - b.orderId
        })
        all.forEach(function(it) {
          if (!MENU_DATA.find(function(ele) {
            return ele.id == it.id
          })) {
            MENU_DATA.push(it)
          }
        })
        MENU_DATA.forEach(function(it) {
          MENU_DATA.forEach(function(ele) {
            if (it.id == ele.parentId) {
              if (it.children) {
                it.children.push(ele)
              } else {
                it.children = new Array()
                it.children.push(ele)
              }
            }
          })
        })
        var resourceTree = MENU_DATA.filter(function(it) {
          return it.parentId == 0
        })
        return resourceTree
      },
      //捕获菜单点击并添加iframe和tabs
      handleMenuClick(item) {
        console.log(item)
        let dom = item.item.$el,
          target = dom.getAttribute('target'),
          title = dom.getAttribute('title')? dom.getAttribute('title'):dom.innerText,
          ele;
        if (!target) return
        ele = this.iframeList.find(it => it.target == target)
        if (ele == null) {
          this.iframeList.push({
            title: title,
            target: target
          })
          this.activeIndex = this.iframeList.length - 1
        } else {
          this.activeIndex = this.iframeList.indexOf(ele)
        }

      }
      ,
      //删除tabsItem
      removeTabItem(target, index) {
        this.iframeList.splice(index, 1)
        if (this.activeIndex == index && this.activeIndex >= this.iframeList.length - 1) {
          this.$nextTick(function() {
            this.activeIndex = this.iframeList.length - 1
          }.bind(this))
        } else if (this.activeIndex >= index) {
          this.$nextTick(function() {
            this.activeIndex--
          }.bind(this))
        }
      }
      ,
      //点击单个item效果
      tabItemClick(it, index) {
        this.activeIndex = index
      }
    }
  }
</script>
<style lang="scss">
    .manager {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .sitename {
        box-sizing: border-box;
        width: 220px;
        height: 50px;
        font-size: 18px;
        text-align: center;
        line-height: 50px;

        &.dark {
            color: white;
        }

        &.light {
            color: black;
            border-bottom: 1px solid #e5e5e5;
        }
    }

    .side-menu {
        width: 220px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
    }

    .side-menu.active, .ant-menu-inline-collapsed {
        @media screen and (max-width: 557px) {
            transform: translateX(-100%);
        }
        @media screen and (min-width: 557px) {
            width: 40px;
        }

    }

    .ant-menu-inline-collapsed > .ant-menu-item,
    .side-menu .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
        padding: 0 12px !important;
    }

    .manager-content {
        height: 100%;
        overflow: hidden;
        background-color: $background;
        @media screen and (max-width: 557px) {
            padding-left: 0px;
            transform: translateX(220px);
        }
        @media screen and (min-width: 557px) {
            padding-left: 220px;
        }

    }

    .manager-content.active {
        @media screen and (max-width: 557px) {
            padding-left: 0px;
            transform: translateX(0px);
        }
        @media screen and (min-width: 557px) {
            padding-left: 40px;
        }
    }

</style>
