<template>
    <basic-layout>
        <!--搜索表单-->
       <!--     <a-form  :form="searchForm">
                <a-row>
                    <a-col :md="6">
                        <a-form-item
                                :label-col="{ span: 8 }"
                                :wrapper-col="{ span:16 }"
                                label="状态">
                            <a-select v-model="search.state" style="width: 100%" placeholder="请选择" >
                                &lt;!&ndash;<a-select-option value="">全部</a-select-option>&ndash;&gt;
                                <a-select-option :value="1">可用的</a-select-option>
                                <a-select-option :value="0">禁止</a-select-option>
                                <a-select-option :value="-1">删除</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6">
                        <a-form-item
                                :wrapper-col="{ md:{span:16,offset:1},xs:{span:24} }"
                        >
                            <a-button type="primary" @click="getData(1)">查询</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>-->
            <a-row>
                <a-col>
                    <a-button type="primary" icon="plus" @click="showAddModal">新增</a-button>
                </a-col>
            </a-row>
            <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="可用的" key="1">
                    <operator-table ref="enable" :state="1"></operator-table>
                </a-tab-pane>
                <a-tab-pane tab="禁止的" key="0" forceRender>
                    <operator-table ref="disable" :state="0"></operator-table>
                </a-tab-pane>
                <a-tab-pane tab="删除的" key="-1">
                    <operator-table ref="deleted" :state="-1"></operator-table>
                </a-tab-pane>
            </a-tabs>
            <!--增加操作员-->
            <a-modal
                    title="新增操作员"
                    :visible="addFormVisible"
                    :confirmLoading="addFormLoading"
                    @ok="saveForm"
                    @cancel="addFormVisible=false">
                <a-form
                        :form="addForm">
                    <a-form-item
                            label="操作员账号"
                            :label-col="{ span:8}"
                            :wrapper-col="{ span: 16 }">
                        <a-input
                                autocomplete="off"
                                v-decorator="['name',{rules: [
                            { required: true,message: '请输入!' },
                            { pattern:/^[A-Za-z0-9]{4,20}$/,message: '4-20位英文字母或数字!' },
                        ]}]"/>
                    </a-form-item>
                    <a-form-item
                            label="确认码可尝试最大次数"
                            :label-col="{ span:8}"
                            :wrapper-col="{ span: 16 }">
                        <a-input   autocomplete="off" maxlength="18" v-decorator="['ccMaxNumRetries',{rules: [
                            { required: true,message: '请输入!' },
                            { pattern:/^[0-9]+$/,message: '请输入数字!' },
                        ]}]"/>
                    </a-form-item>
                    <a-form-item
                            label="订单可尝试下载次数"
                            :label-col="{ span:8}"
                            :wrapper-col="{ span: 16 }">
                        <a-input   autocomplete="off" maxlength="18" v-decorator="['orderMaxNumRetries',{rules: [
                            { required: true,message: '请输入!' },
                            { pattern:/^[0-9]+$/,message: '请输入数字!' },
                        ]}]"/>
                    </a-form-item>
                    <a-form-item
                            label="订单有效期(小时)"
                            :label-col="{ span:8}"
                            :wrapper-col="{ span: 16 }">
                        <a-input   autocomplete="off" maxlength="18" v-decorator="['orderEffectiveDuration',{rules: [
                            { required: true,message: '请输入!' },
                            { pattern:/^[0-9]+$/,message: '请输入数字!' },
                        ]}]"/>
                    </a-form-item>

                </a-form>
            </a-modal>
    </basic-layout>
</template>

<script>
    import OperatorTable from "./operatorTable"
  export default {
    name: 'app',
    data(){
      return {
        addFormVisible:false, //增加操作员显示/隐藏
        addFormLoading:false, //增加模态框spinner
        addForm:this.$form.createForm(this), //增加表单对象
      }
    },
    components:{
      "operatorTable":OperatorTable
    },
    methods:{
      //初始化新增操作员表单
      showAddModal(){
        this.addForm.resetFields()
        this.addFormVisible = true;
      },
      //提交表单
      saveForm(e){
        e.preventDefault();
        let self = this;
        this.addForm.validateFields(async(err, values) => {
          if (!err) {
               this.addFormLoading = true;
            let data = await self.$axios({
              method:'post',
              url:'/operator/add',
              data:{...values}
            })
            this.addFormLoading = false;
            if(data.code=='0'){
              this.addFormVisible = false;
              //self.showSuccess();
              self.addFormVisible = false;
              if(this.$refs.enable)this.$refs.enable.getData();
              if(this.$refs.disable)this.$refs.disable.getData();
              if(this.$refs.deleted)this.$refs.deleted.getData();
            }
          }
        });
      },

    }

  }
</script>

<style lang="scss">

</style>
