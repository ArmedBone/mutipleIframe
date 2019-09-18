<template>
    <div class="page-wrapper">
        <div class="page-content">
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
                                <a-select-option v-for="it in partnerList" :value="it.id">{{it.partnerName}}</a-select-option>
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
            <a-row style="margin-top: 20px">
                <a-col>
                    <a-button type="primary" icon="plus">新增</a-button>
                </a-col>
            </a-row>
            <a-table style="margin-top: 20px"
                     :pagination="pagination"
                    :columns="columns"
                    :rowKey="record => record.id"
                     :scroll="{ x: 800 }"
                     @change="handleTableChange"
                    :dataSource="dataList">
                <div slot="action" slot-scope="text, record">
                    <span class="ant-dropdown-link">
                        编辑
                    </span>
                </div>
            </a-table>
        </div>
    </div>
</template>

<script>
  import AFormItem from 'ant-design-vue/es/form/FormItem'
  import ARow from 'ant-design-vue/es/grid/Row'
  export default {
    name: 'app',
    components: { ARow, AFormItem },
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
        dataList:[],
        partnerList:[]
      }
    },
    created(){
      this.getPartnerList();
      this.getData(1);
    },
    methods:{
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
    }
  }
</script>

<style lang="scss">

</style>
