
export default {
  data() {
    return {
      tabsContent: null, //tabs标签容器
      prevButton:null, //上一组的按钮
      nextButton:null,//下一组的按钮
      contentWrapper:null,//iframe容器
      iframesMap:{},
      offsetIndex: 0,
    }
  },
  mounted() {
    let self = this;
    this.tabsContent = this.$refs.managerTabs.$refs.tabsContent;
    this.prevButton = this.$refs.managerTabs.$refs.prevButton;
    this.nextButton = this.$refs.managerTabs.$refs.nextButton;
    this.contentWrapper = this.$refs.managerTabs.$refs.contentWrapper;
    //绑定按钮事件
    this.prevButton.addEventListener('click',self.prevOffset);
    this.nextButton.addEventListener('click',self.nextOffset);
  },
  methods: {
    createBitClose(){
      let inner = `<svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>`
      let close = document.createElement('i');
      close.classList.add('anticon');
      close.classList.add('anticon-close')
      close.innerHTML = inner;
      close.addEventListener('click',this.removeTabItem)
      return close;
    },
    //创建标签
    createTag(target, title) {
      let tag = document.createElement('div');
      tag.setAttribute('target', target);
      tag.classList.add('ant-tag');
      tag.classList.add('ant-tag-blue');
      tag.innerText=title;
      tag.appendChild(this.createBitClose(title));
      return tag
    },
    //删除tabsItem
    removeTabItem(event) {
      event.stopPropagation();
      let tag = event.currentTarget.parentNode;
      let target = tag.getAttribute('target');
      let item = tag.parentNode;
      if(tag.classList.contains('ant-tag-blue'))this.switchActive(item);
      item.remove();
      this.iframesMap[target].remove();
      delete this.iframesMap[target];
      item.remove();
    },
    switchActive(item){
      console.log("mayuyu")
      let prev = item.previousSibling;
      let next = item.nextSibling;
      if(prev){
        let tag = prev.querySelector('.ant-tag');
        let target = tag.getAttribute('target');
        this.activeThisTag(target);
      }
      if(!prev && next){
        let tag = next.querySelector('.ant-tag');
        let target = tag.getAttribute('target');
        this.activeThisTag(target);
      }
    },
    //创建标签容器
    createTagCon(target, title) {
      let ele = document.createElement('div')
      let tag = this.createTag(target, title)
      ele.classList.add('manager-tabs-content-item')
      ele.appendChild(tag)
      ele.addEventListener('click',this.tabConItemHandleClick.bind(this))
      return ele
    },
    //创建iframe
    createIframe(target){
      let iframe = document.createElement('iframe');
      iframe.classList.add('content-iframe');
      iframe.classList.add('active');
      iframe.setAttribute('frameborder','0');
      iframe.setAttribute('src',target);
      this.iframesMap[target]=iframe;
      return iframe;
    },
    //点击标签的事件
    tabConItemHandleClick(event){
        var tag =event.currentTarget.querySelector('.ant-tag');
        var target = tag.getAttribute('target');
        this.cleanSiblings();
        tag.classList.add('ant-tag-blue');
        let iframe = this.getIframeByTarget(target);
        iframe.classList.add('active');
    },
    //获取到所有的标签数组
    getTabsList() {
      return Array.prototype.slice.call(this.tabsContent.querySelectorAll('.ant-tag'))
    },
    getTabsCon() {
      return Array.prototype.slice.call(this.tabsContent.querySelectorAll('.manager-tabs-content-item'))
    },
    getTabsSize() {
      return this.tabsContent.querySelectorAll('.ant-tag').length
    },
    //获取所有的iframes
    getIframes(){
      return Array.prototype.slice.call(this.contentWrapper.querySelectorAll('iframe'));
    },
    getIframeByTarget(target){
      let iframes = this.getIframes();
      return iframes.find(it=>it.getAttribute('src')==target);
    },
    //是否已有这个标签
    hasThisTag(target) {
      let tags = this.getTabsList()
      return tags.find(it => {
        return it.getAttribute('target') == target
      })
    },
    //清除标签兄弟节点的效果
    cleanSiblings() {
      let tags = this.getTabsList();
      let iframes = this.getIframes();
      tags.forEach(it => {
        if (it.classList.contains('ant-tag-blue')) it.classList.remove('ant-tag-blue');
      })
      iframes.forEach(it=>{
        if (it.classList.contains('active')) it.classList.remove('active');
      })
    },
    //激活当前标签
    activeThisTag(target) {
      let tag = this.hasThisTag(target)
      tag.classList.add('ant-tag-blue');
      let iframe  = this.getIframeByTarget(target);
      iframe.classList.add('active');
    },
    //捕获菜单点击并添加iframe和tabs
    handleMenuClick(item) {
      let dom = item.item.$el,
        target = dom.getAttribute('target'),
        dataId = dom.getAttribute('data-id'),
        title = dom.getAttribute('title') ? dom.getAttribute('title') : dom.innerText
      if (!target) return
      //清除兄弟节点上的效果
      this.cleanSiblings()
      //如果存在tag，便激活它
      if (this.hasThisTag(target)) {
        this.activeThisTag(target)
        return
      }
      //添加小标签
      let tagCon = this.createTagCon(target, title);
      let iframe = this.createIframe(target);
      this.tabsContent.appendChild(tagCon);
      this.contentWrapper.appendChild(iframe);
      //计算tagsContent的位置
     this.prevOffset();
    },
    prevOffset(){
      let tagsLength = this.getTabsSize()
      if (tagsLength - this.offsetIndex > 6) this.offsetIndex += 6;
      this.calcTagsContentPosition();
    },
    nextOffset(){
      this.offsetIndex>6?this.offsetIndex -=6:this.offsetIndex=0;
      this.calcTagsContentPosition();
    },
    //回到当前标签
    backCurrent(activeIndex){
      this.offsetIndex=activeIndex;
      this.calcTagsContentPosition();
    },
    //删除其他兄弟
    removeSiblings(){
      let tagsCon = this.getTabsCon();
      let iframes = this.getIframes();
      tagsCon.forEach(it => {
        if (!it.children[0].classList.contains('ant-tag-blue')) it.remove();
      })
      iframes.forEach(it=>{
        if (!it.classList.contains('active')) it.remove();
      })
      this.offsetIndex=0;
      this.calcTagsContentPosition();
    },
    //删除所有的标签
    removeAllTags(){
      let tagsCon = this.getTabsCon();
      let iframes = this.getIframes();
      tagsCon.forEach(it => {
         it.remove();
      })
      iframes.forEach(it=>{
        it.remove();
      })
      this.offsetIndex=0;
      this.calcTagsContentPosition();
    },
    //计算tagsContent的位置
    calcTagsContentPosition() {
      let offsetLeft = this.getTabsCon().slice(0, this.offsetIndex).reduce(function(p, item, i) {
        return p + Math.ceil(item.offsetWidth)
      }, 0)
      this.tabsContent.style.left = -offsetLeft + 'px'
    },
  }
}
