<template>
    <basic-layout>
        <!--搜索表单-->
            <a-form  :form="searchForm">
                <a-row>
                    <a-col :md="6">
                        <a-form-item
                                :label-col="{ span: 8 }"
                                :wrapper-col="{ span:16 }"
                                label="操作员账号">
                            <a-input v-model="search.userName" placeholder="请输入" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6">
                        <a-form-item
                                :label-col="{ span: 8 }"
                                :wrapper-col="{ span:16 }"
                                label="姓名">
                            <a-input v-model="search.nickName" placeholder="请输入" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="6">
                        <a-form-item
                                :label-col="{ span: 8 }"
                                :wrapper-col="{ span:16 }"
                                label="合作方">
                            <a-select v-model="search.partnerId" style="width: 100%" placeholder="请选择" >
                                <a-select-option value="">全部</a-select-option>
                                <a-select-option v-for="it in partnerList" :key="it.id" :value="it.id">{{it.partnerName}}</a-select-option>
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
            </a-form>
            <a-row>
                <a-col>
                    <a-button type="primary" icon="plus" @click="showAddModal">新增</a-button>
                </a-col>
            </a-row>
        <!--数据表格-->
            <a-table style="margin-top: 20px"
                     :pagination="pagination"
                    :columns="columns"
                    :rowKey="record => record.id"
                     :scroll="{ x: 800 }"
                     @change="handleTableChange"
                    :dataSource="dataList">
                <div slot="action" slot-scope="text, record">
                    <span class="text-link">
                        编辑
                    </span>
                    <span class="text-link" @click="getUserRelationship(record)">
                        角色分配
                    </span>
                </div>
            </a-table>
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
        <!--操作员赋予角色-->
        <a-modal
                title="角色分配"
                :visible="roleVisible"
                @ok="handleRoleOk"
                :confirmLoading="roleLoading"
                @cancel="roleVisible=false"
        >
            <div>
                <a-checkbox-group :options="allRoleAndUserRelationship" v-model="hasRoleList"  />
            </div>
        </a-modal>

    </basic-layout>
</template>

<script>
  export default {
    name: 'app',
    data(){
      return {
        searchForm: this.$form.createForm(this),
        search:{
          userName:'',
          nickName:'',
          partnerId:'',
          pageNum: 1,
          pageSize: 10
        },
        pagination:{},
        /*表格数据列*/
        columns:[
          {
            title:"管理员账号",
            dataIndex:'userName'
          },
          {
            title:"昵称",
            dataIndex:'nickName'
          },
          {
            title:"合作方",
            dataIndex:'partnerId'
          },
          {
            title:'邮箱',
            dataIndex:"email"
          },
          {
            title:'操作',
            scopedSlots: { customRender: 'action' },
          }
        ],
        dataList:[], //表格数据源
        partnerList:[],/*合作伙伴列表*/
        addFormVisible:false, //增加操作员显示/隐藏
        addFormLoading:false, //增加模态框spinner
        addForm:this.$form.createForm(this), //增加表单对象
        allRoleAndUserRelationship:[], //操作员查询到的所有角色列表
        roleVisible:false,//角色分配显示与隐藏
        roleLoading:false,//角色加载中的spinner
        hasRoleList:[],//赋予的权限
        roleCurrentId:-1
      }
    },
    created(){
      /*this.getPartnerList();
      this.getData(1);*/
    },
    methods:{
      //获取到所有的合作商
        async getPartnerList(){
            var data = await this.$axios({
              method:'get',
              url:'/partner/list',
            })
          this.partnerList = data.data;
        },
      //查询用户
      async getData(pageNum){
        if(pageNum)this.search.pageNum=pageNum;
        var data = await this.$axios({
                      url:'/usermanager/list',
                      method:'get',
                      params:{
                        ...this.search
                      }
                    })
        if(data.key=='0000'){
          this.dataList = data.dataList;
          const pagination = { ...this.pagination };
          pagination.total =data.totalCount;
          this.pagination = pagination;
        }
      },
      //分页逻辑
      handleTableChange (pagination, filters, sorter) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.getData(pager.current);
      },
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
            if(data.key=='0000'){
              this.addFormVisible = false;
              //self.showSuccess();
              self.getData();
            }
          }
        });
      },
      //查询操作员的权限
    async getUserRelationship(record){
          this.roleCurrentId = record.id;
      let data = await this.$axios({
        method:'post',
        url:'/role/allRoleAndUserRelationship',
        params:{"userId":record.id}
      })
      if(data.key=="0000"){
        this.hasRoleList=[];
        this.allRoleAndUserRelationship=data.data.map(it=>{
          if(it.roleId)this.hasRoleList.push(it.id);
          return{
            'label':it.roleName,
            'value':it.id
          }
        });
        this.roleVisible=true;
      }
    },
      //提交角色分配
      async handleRoleOk(){
        this.roleLoading=true;
        let data = await this.$axios({
          method:'post',
          url:'/role/addUserToRole',
          params:{
           "userToRoleBean": {"userId":this.roleCurrentId,"roleIdList":this.hasRoleList}
          }
        })
        this.roleLoading=false;
        if(data.key=="0000"){
          this.roleVisible=false;
        }
      }
    }

  }
</script>

<style lang="scss">

</style>
