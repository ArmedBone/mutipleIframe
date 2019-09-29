<template>
    <basic-layout>
       <a-row>
           <a-col
                   :lg="{span:12,offset:6}">
               <a-form class="profile-form"  :form="addForm">
                   <a-form-item
                   :label="$t('m.uploadProfile.upload')"
                   :label-col="{ span:4}"
                   :wrapper-col="{ span: 16 }">
                       <a-upload
                               v-decorator="[ 'jsonData',{rules: [{ required:true, message:()=>$t('m.uploadProfile.uploadFile') }]}]"
                               name="file"
                               :multiple="true"
                               :fileList="fileList"
                               :action="uploadUrl"
                               :headers="headers"
                               @change="handleUploadChange">
                           <a-button style="float: left">
                               <a-icon type="upload"/>
                               {{$t('m.uploadProfile.selectFile')}}
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
                            { required: true,message: ()=>$t('m.uploadProfile.inputKey') },
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
                                 :wrapper-col="{ lg:{span: 16,offset:4},xs:{span:24} }">
                        <a-button style="margin-right: 10px" @click="reloadPage()">
                            {{ $t('m.common.reset')}}
                        </a-button>
                        <a-button type="primary" @click="submitForm">
                            {{ $t('m.common.confirm')}}
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
        isCI:true,
        uploadUrl:sessionStorage.getItem('baseURL')+'/gsma/rsp/manager/cert/parse'
      }
    },
    watch:{
      '$i18n.locale'(nv){
        console.log(nv)
        console.log(this.$t('m.uploadProfile.uploadFile'))
        this.addForm.validateFields(['jsonData','privateSecret'],{ force: true })
         // this.$set(this,'jsonDataError',this.$t('m.uploadProfile.uploadFile'));
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
          url:'/gsma/rsp/manager/cert/store',
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
