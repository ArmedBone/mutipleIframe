<template>
    <div class="page-wrapper">
        <div class="page-content">
            <a-tabs defaultActiveKey="1" tabPosition="left">
                <a-tab-pane tab="个性化修改" key="1">
                    <customSet></customSet>
                </a-tab-pane>
                <a-tab-pane tab="修改密码" key="2">Content of tab 2</a-tab-pane>
                <a-tab-pane tab="Tab 3" key="3">Content of tab 3</a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
  import customSet from "./custom";

  export default {
    name: 'app',
    components:{
      "customSet":customSet
    }
  }
</script>

<style lang="scss">

</style>
