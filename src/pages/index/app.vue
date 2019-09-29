<template>
    <basic-layout type="empty">
        <div class="login">
            <div class="login-wrapper">
                <div class="login-form">
                    <h1>
                        <!--<img src="../../assets/img/logo.png" class="company-log">-->
                        Remote <span class="text-primary" style="font-weight: 500">SIM Provisioning</span> Platform
                    </h1>
                    <a-form :form="form">
                        <a-form-item>
                            <a-input v-decorator="['userName',{rules: [{ required: true, message:$t('m.index.usernameErr') }]} ]">
                                <a-icon slot="prefix" type="user"/>
                            </a-input>
                        </a-form-item>
                        <a-form-item>
                            <a-input type="password"
                                     v-decorator="['passWord',{rules: [{ required: true, message:$t('m.index.passwordErr') }]} ]">
                                <a-icon slot="prefix" type="lock"/>
                            </a-input>
                        </a-form-item>
                        <a-form-item style="text-align: center">
                            <a-button style="width: 100%" type="primary" @click="handleSubmit">
                                {{$t('m.index.logIn')}}
                            </a-button>
                        </a-form-item>
                    </a-form>
                    <!--<p style="color: rgba(0,0,0,0.35);text-align: center">第一次使用请修改密码</p>-->
                </div>
            </div>
        </div>
    </basic-layout>
</template>

<script>
  import { setToken } from '../../utils/data'
  import basicLayout from '@/layout/basicLayout'

  export default {
    data() {
      return {
        search: {},
        userName: '',
        passWord: '',
        formLayout: 'horizontal',
        form: this.$form.createForm(this)
      }
    },
    components: {
      'basic-layout': basicLayout
    },
    mounted(){
      console.log(this.$t)
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault()
        var self = this
        this.form.validateFields((err, values) => {
          if (!err) {
            self.login(values)
          }
        })
      },
      async login(values) {
        setToken('')
        location.assign('manager.html')
        return;
        var data = await this.$axios({
          url: '/login',
          method: 'post',
          params: { ...values }
        })
        if (data.key == '0000') {
          setToken(data.data.TOKEN)
          location.assign('manager.html')
        }
      }
    }
  }
</script>

<style lang="scss">
    .login {
        width: 100vw;
        height: 100vh;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        overflow: hidden;
        position: relative;
        background-image: url("../../assets/img/web_bg.png");

        &-wrapper {
            @media screen and (max-width: 557px) {
                width: 90%;
                @include local-center;
            }
            @media screen and (min-width: 557px) {
                width: 360px;
                @include local-center;
            }

            & h1 {
                font-size: 24px;
                color: lighten($title, 30);
                font-weight: 300;
                text-align: center;
                margin-bottom: 20px;

                & .company-log {
                    width: 30px;
                    height: 30px;
                    background-color: $primary;
                    border-radius: 4px;
                    vertical-align: sub;
                }
            }
        }

        &-form {
            padding: 30px 30px 20px;
            border-radius: $boder-radius;
            background-color: white;

            .ant-form-item {
                margin-bottom: 12px;
            }
        }
    }
</style>
