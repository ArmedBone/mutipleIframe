<template>
    <div class="page-wrapper">
        <div class="xhr-status-content">
            <div class="xhr-image-container">
                <img class="xhr-image" src="../../assets/img/404.svg">
            </div>
            <div class="xhr-details">
                <h1 class="xhr-code">404</h1>
                <div class="xhr-desc">抱歉，你访问的页面不存在或仍在开发中</div>
            </div>
        </div>
    </div>
</template>

<script>
  import ACol from 'ant-design-vue/es/grid/Col'
  export default {
    name: 'app',
    components: { ACol }
  }
</script>

<style lang="scss">
    .xhr-status-content{
        position: absolute;
        width: 100%;
        @include local-center;
        user-select: none;
        & .xhr-image-container{
            @media screen and (max-width: 557px) {
                width: 300px;
                margin: 0 auto;
            }
            @media screen and (min-width: 557px) {
                width: 50%;
                height: 341px;
                float: left;
            }
            & .xhr-image{
                margin: 0 auto;
                display: block;
                @media screen and (max-width: 557px) {
                    width: 100%;
                }
                @media screen and (min-width: 557px) {
                    width:auto;
                }
            }
        }

        & .xhr-details{
            @media screen and (max-width: 557px) {
                width: 100%;
                text-align: center;
                padding: 0 10px;
            }
            @media screen and (min-width: 557px) {
                width: 50%;
                height: 341px;
                float: left;
                position: relative;
            }
            & .xhr-code{
                line-height: 110px;
                margin-bottom: 0px;
                @media screen and (max-width: 557px) {
                    font-size: 52px;
                    margin-top: 0px;
                }
                @media screen and (min-width: 557px) {
                    font-size: 72px;
                    margin-top: 60px;
                }
            }
            & .xhr-desc{
                @media screen and (max-width: 557px) {
                    font-size: 16px;
                }
                @media screen and (min-width: 557px) {
                    font-size: 20px;
                }
                color:$content;
            }
        }

    }
</style>
