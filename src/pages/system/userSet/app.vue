<template>
    <basic-layout>
        <a-tabs defaultActiveKey="1" tabPosition="left">
            <a-tab-pane :tab="$t('m.userSettings.personalise')" key="1">
                <customSet></customSet>
            </a-tab-pane>
        </a-tabs>
    </basic-layout>
</template>

<script>
  import customSet from './custom'

  export default {
    name: 'app',
    components: {
      'customSet': customSet
    }
  }
</script>

<style lang="scss">

</style>
