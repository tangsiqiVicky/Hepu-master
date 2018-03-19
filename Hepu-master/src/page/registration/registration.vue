<template>
    <div class="restContainer">
        <head-top head-title="注册" goBack="true"></head-top>
        <form class="restForm">
            <section class="input_container phone_number">
                <input style="width: 70%"  type="text" placeholder="手机号" name="phone" maxlength="11" v-model="phoneNumber" @input="inputPhone">
                <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
                <button  @click.prevent v-show="computedTime">已发送({{computedTime}}s)</button>
            </section>
            <section class="input_container captcha_code_container">
                <input style="width: 100%" type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
            </section>
        </form>


        <div class="login_container" @click="resetButton">确认</div>
        <router-link to="/login" class="to_forget" >登录？</router-link>
        <!--<router-link to="/forget" class="to_forget">重置密码？</router-link>-->
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>

    </div>

</template>

<script>
    import headTop from 'src/components/header/head'
    import alertTip from 'src/components/common/alertTip'
    import {mobileCode, register, sendMobile, getcaptchas, changePassword} from 'src/service/getData'

    export default {
        data(){
            return {
                phoneNumber: null, //电话号码
                rightPhoneNumber: false, //输入的手机号码是否符合要求
                mobileCode: null, //短信验证码
                computedTime: 0, //倒数记时
                showAlert: false, //显示提示组件
                alertText: null, //提示的内容
                accountType: 'mobile',//注册方式
                captchaCodeImg: null,
            }
        },
        components: {
            headTop,
            alertTip,
        },
        created(){
//          document.title = '注册';
        },
        methods: {
            //判断输入的电话号码
            inputPhone(){
//              [1][3,4,5,7,8][0-9]{9}
                if(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phoneNumber)){
                    this.rightPhoneNumber = true;
                }else{
                    this.rightPhoneNumber = false;
                }
            },
            //获取验证吗
            async getVerifyCode(){
                if (this.rightPhoneNumber) {
                    this.computedTime = 30;
                    //倒计时
                    this.timer = setInterval(() => {
                        this.computedTime --;
                        if (this.computedTime == 0) {
                            clearInterval(this.timer)
                        }
                    }, 1000)
                    //判断用户是否存在
//                    let res = await checkExsis(this.phoneNumber, this.accountType);
                    //判断返回的信息是否正确，用户是否注册
//                    if (res.message) {
//                        this.showAlert = true;
//                        this.alertText = res.message;// 弹出消息
//                        return
//                    }else if(!res.is_exists) {
//                        this.showAlert = true;
//                        this.alertText = '您输入的手机号尚未绑定';
//                        return
//                    }
                    //获取验证信息
                    let getCode = await mobileCode(this.phoneNumber);
//                    getCode = getCode.data[0];
//                    if (getCode.result) {
//                        this.showAlert = true;
//                        this.alertText = getCode.result_text;
//                        return
//                    }
//                    this.validate_token = getCode.validate_token;
                }
            },
             async getCaptchaCode(){
                let res = await getcaptchas();
                this.captchaCodeImg = res.code;
            },
            //重置密码
            async resetButton(){
//                if (!this.phoneNumber) {
//                    this.showAlert = true;
//                    this.alertText = '请输入正确的账号';
//                    return
//                }
//                else if(!this.oldPassWord){
//                    this.showAlert = true;
//                    this.alertText = '请输入旧密码';
//                    return
//                }else if(!this.newPassWord){
//                    this.showAlert = true;
//                    this.alertText = '请输入新密码';
//                    return
//                }else if(!this.confirmPassWord){
//                    this.showAlert = true;
//                    this.alertText = '请输确认密码';
//                    return
//                }else if(this.newPassWord !== this.confirmPassWord){
//                    this.showAlert = true;
//                    this.alertText = '两次输入的密码不一致';
//                    return
//                }
//                else if(!this.mobileCode){
//                    this.showAlert = true;
//                    this.alertText = '请输验证码';
//                    return
//                }
                // 发送重置信息
                let res = await register(this.phoneNumber, this.mobileCode);
                res = res.data[0]
                if (res.result === '1') {
                    this.showAlert = true;
                    this.alertText = "首次注册密码为手机号后六位";
                    this.$router.push('/login')
//                    this.getCaptchaCode()
                    return
                }else{
                    this.showAlert = true;
                    this.alertText = res.result_text;
                }
            },
            closeTip(){
                this.showAlert = false;
            }
        }
    }

</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .restContainer{
        padding-top: 1.95rem;
    }
    .restForm{
        background-color: #fff;
        margin-top: .6rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            input{
                @include sc(.7rem, #666);
            }
            button{
                background: rgba(117,117,117,0.4);
                @include sc(.65rem, #fff);
                font-family: Helvetica Neue,Tahoma,Arial;
                padding: .28rem .4rem;
                border: 1px;
                border-radius: 0.15rem;
            }
            .right_phone_number{
                background-color: #ff8522;
            }
        }
        .phone_number{
            padding: .3rem .8rem;
        }
        .captcha_code_container{
            height: 2.2rem;
            .img_change_img{
                display: flex;
                align-items: center;
                img{
                    @include wh(3.5rem, 1.5rem);
                    margin-right: .2rem;
                }
                .change_img{
                    display: flex;
                    flex-direction: 'column';
                    flex-wrap: wrap;
                    width: 2rem;
                    justify-content: center;
                    p{
                        @include sc(.55rem, #666);
                    }
                    p:nth-of-type(2){
                        color: #3b95e9;
                        margin-top: .2rem;
                    }
                }
            }
        }
    }
    .captcha_code_container{
        height: 2.2rem;
        .img_change_img{
            display: flex;
            align-items: center;
            img{
                @include wh(3.5rem, 1.5rem);
                margin-right: .2rem;
            }
            .change_img{
                display: flex;
                flex-direction: 'column';
                flex-wrap: wrap;
                width: 2rem;
                justify-content: center;
                p{
                    @include sc(.55rem, #666);
                }
                p:nth-of-type(2){
                    color: #3b95e9;
                    margin-top: .2rem;
                }
            }
        }
    }
    .login_container{
        margin: 1rem .5rem;
        @include sc(.7rem, #fff);
        background-color: #ff8522;
        padding: .5rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;
    }
    .to_forget{
      float: right;
      @include sc(.6rem, #3b95e9);
      margin-right: .3rem;
    }

</style>
