<template>
    <div>
        <!--数据表格-->
        <a-table style="margin-top: 20px"
                 :pagination="pagination"
                 :columns="columns"
                 :rowKey="(r,i)=>i"
                 :scroll="{ x: 800 }"
                 @change="handleTableChange"
                 :dataSource="dataList">
            <div slot="action" slot-scope="text, record">
                <a-popconfirm placement="rightBottom" okText="Yes" cancelText="No" @confirm="confirmDel(record.requesterIdentifier)">
                    <template slot="title">
                        <p>确定执行删除操作</p>
                    </template>
                    <span class="text-link">
                       删除
                    </span>
                </a-popconfirm>

            </div>
        </a-table>
    </div>
</template>

<script>
  export default {
    name: 'operatorTable',
    data(){
      return {
        searchForm: this.$form.createForm(this),
        search:{
          state:this.state,
          pageNum: 1,
          pageSize: 10
        },
        pagination:{},
        /*表格数据列*/
        columns:[
         /* "state": 1,
        "requesterIdentifier": "1991570781536452",*/

          {
            title:"操作员账号",
            dataIndex:'name'
          },
          {
            title:"确认码可尝试最大次数",
              dataIndex:'ccMaxNumRetries'
          },
          {
            title:"订单可尝试下载次数",
            dataIndex:'orderMaxNumRetries'
          },
          {
            title:'订单有效期(小时)',
            dataIndex:"orderEffectiveDuration"
          },
          {
            title:'更新时间',
              dataIndex:"updateTime"
          },
          {
            title:'操作',
            scopedSlots: { customRender: 'action' },
          }
        ],
        dataList:[], //表格数据源
      }
    },
    props:{
      state:{
        type:Number,
        default:1
      }
    },
    created(){
      /*this.getPartnerList();*/
      this.getData(1);
    },
    methods:{
      //查询用户
      async getData(pageNum){
        if(pageNum)this.search.pageNum=pageNum;
        var data = await this.$axios({
          url:'/operator/list',
          method:'post',
          data:{
            ...this.search
          }
        })
        if(data.code=='0'){

          this.dataList = data.data.operators;
          const pagination = { ...this.pagination };
          pagination.total =data.data.totalCount;
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
      async confirmDel(requesterIdentifier){
        var data = await this.$axios({
          url:'/operator/delete',
          method:'post',
          data:{
            "requesterIdentifier":requesterIdentifier
          }
        })
        if(data.code=='0'){
          this.$message.success('操作成功!');
          this.getData(1);
        }
      }
    }

  }
</script>

<style lang="scss">

</style>
