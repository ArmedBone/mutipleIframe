<template>
  <div class="login">
      <div class="login-wrapper">
        <h1>全球移动<span class="text-primary">流量</span>管理平台</h1>
        <div class="login-form">
          <a-form :form="form" >
            <a-form-item>
              <a-input v-decorator="['userName',{rules: [{ required: true, message: '请输入您的账户!' }]} ]">
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input type="password" v-decorator="['passWord',{rules: [{ required: true, message: '请输入您的密码!' }]} ]">
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
            <a-form-item style="text-align: center">
              <a-button style="width: 100%" type="primary" @click="handleSubmit">
                登录
              </a-button>
            </a-form-item>
          </a-form>
          <p style="color: rgba(0,0,0,0.35);text-align: center">第一次使用请修改密码</p>
        </div>
      </div>
  </div>
</template>

<script>
  import {setToken} from "../../utils/data"
export default {
  data() {
    return {
      search:{},
      userName:"",
      passWord:"",
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
    }
  },
  methods: {
    handleSubmit(e){
      e.preventDefault();
      var self = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          self.login(values);
        }
      });
    },
    async login(values){
     var data = await this.$axios({
        url:"/login",
        method:"post",
        params:{...values},
      })
      if(data.key=="0000"){
        setToken(data.data.TOKEN);
        location.assign("manager.html")
      }
    }
  }
}
</script>

<style lang="scss">
.login{
  width: 100vw;
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  position: relative;
  background-image: url("../../assets/img/web_bg.png");
  &-wrapper{
    @media screen and (max-width: 557px) {
      width: 90%;
      @include local-center;
    }
    @media screen and (min-width: 557px) {
      width: 360px;
      @include local-center;
    }
    & h1{
      font-size: 24px;
      color: white;
      text-align: center;
      margin-bottom: 30px;
    }
  }
  &-form{
    padding:40px 30px 20px;
    border-radius: $boder-radius;
    background-color: white;
    .ant-form-item{
      margin-bottom: 12px;
    }
  }
}
</style>
