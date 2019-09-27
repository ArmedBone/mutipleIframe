<template>
    <basic-layout>
       <a-row>
           <a-col
                   :lg="{span:12,offset:6}">
               <a-form class="profile-form"  :form="addForm">
                   <a-form-item
                   label="上传"
                   :label-col="{ span:4}"
                   :wrapper-col="{ span: 16 }">
                       <a-upload
                               v-decorator="[
                              'jsonData',
                              {rules: [{ required:true, message: '请上传文件' }]}
                            ]"
                               name="file"
                               :multiple="true"
                               :fileList="fileList"
                               action="http://192.168.0.200:9000/gsma/rsp/manager/cert/parse"
                               :headers="headers"
                               @change="handleUploadChange">
                           <a-button style="float: left">
                               <a-icon type="upload"/>
                               选择证书文件
                           </a-button>
                       </a-upload>
                   </a-form-item>
                   <json-viewer
                           :value="jsonData"
                           copyable
                           boxed
                           sort></json-viewer>
                   <a-form-item
                           v-if="!isCI"
                           label="privateSecret"
                           :label-col="{ span:4}"
                           :wrapper-col="{ span: 16 }">
                       <a-input autocomplete="off" v-decorator="['privateSecret',{rules: [
                            { required: true,message: '请输入秘钥!' },
                        ]}]"/>
                   </a-form-item>
                   <a-form-item
                           label="remarks"
                           :label-col="{ span:4}"
                           :wrapper-col="{ span: 16 }">
                       <a-input
                               autocomplete="off"
                               v-decorator="['remarks']"/>
                   </a-form-item>
                    <a-form-item
                            style="text-align: right"
                                 :wrapper-col="{ span: 16,offset:4 }">
                        <a-button style="margin-right: 10px" @click="reloadPage()">
                            重置
                        </a-button>
                        <a-button type="primary" @click="submitForm">
                            提交
                        </a-button>
                    </a-form-item>

               </a-form>
           </a-col>
       </a-row>
    </basic-layout>
</template>
<script>
  import Vue from 'vue'
  import ARow from 'ant-design-vue/es/grid/Row'
  import JsonViewer from 'vue-json-viewer';
  import AFormItem from 'ant-design-vue/es/form/FormItem'
  Vue.use(JsonViewer)
  export default {
    components: { AFormItem, ARow },
    data() {
      return {
        headers: {
          authorization: 'authorization-text',
        },
        addForm: this.$form.createForm(this), //增加表单对象
        jsonData:{},//json内容
        fileList:[],//文件内容
        isCI:true
      }
    },
    methods: {
      //上传证书文件报文
      handleUploadChange(info) {
        this.fileList=[info.file]
        let self = this;
        if (info.file.status === 'done') {
          let res = info.file.response;
          if(res.code=='0'){
            //json数据
            this.jsonData= res.data;
            //判断是否为CI文件:不含有'authorityKeyIdentifier' 为CI证书
            this.isCI=res.data['authorityKeyIdentifier']!=null?false:true;
            this.$message.success(`${info.file.name} file uploaded successfully`);
          }else{
            this.jsonData ={};
            this.$message.error(res.message);
          }
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`)
        }
      },
      //校验新增表单数据
      submitForm (e) {
        e.preventDefault();
        let self = this;
        this.addForm.validateFields((err, values) => {
          if (!err) {
            let fileData = values.jsonData.file.response.data;
           let params = {
              "fileName":fileData.fileName,
              "fileContent":fileData.fileContent, //.replace(/\r\n/g, '').replace(/\n/g, ''),
              "remarks":values.remarks
            }
            //不是CI证书需要填写秘钥
           if(values.privateSecret)params.privateSecret =values.privateSecret.replace(/\s/g, '');
            self.sendFormData(params)
          }
        });
      },
      //将新增表单数据提交到后台
      async sendFormData(params){
        let data = await this.$axios({
          method:'post',
          url:'http://192.168.0.200:9000/gsma/rsp/manager/cert/store',
          data:params
        })
        if(data.code=='0'){
          this.$message.success(`操作成功,页面即将刷新`);
          setTimeout(function() {

          },1500)
        }
      },
      reloadPage(){
        window.location.reload();
      }
    }
  }
</script>
<style lang="scss">
  /* .profile-form .ant-upload-list-item-info{
       float: left;
       width: 300px;
   }*/

</style>
