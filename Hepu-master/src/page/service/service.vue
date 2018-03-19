 <template>
  <div class="rating_page">
        <head-top head-title="服务中心" go-back='true'></head-top>
        <section class="service_connect">
            <!--<a href="http://shang.qq.com/open_webaio.html?sigt=c381764d19291f97c1ecd524ac775ea91d728232ba7a24ceab0419688c137b9c952412d0d0c5c423997360c659f95ac9&sigu=e5e95ecce13386979bf009554e9f6689dcce06fe6a34589799a720bf13cfb016e00f13f3a4231c18&tuin=2853938518" class="service_left">-->
          <a href="#" @click="tocustom()">
            <!--<a href="http://shang.qq.com/open_webaio.html?sigt=c381764d19291f97c1ecd524ac775ea91d728232ba7a24ceab0419688c137b9c952412d0d0c5c423997360c659f95ac9&sigu=e5e95ecce13386979bf009554e9f6689dcce06fe6a34589799a720bf13cfb016e00f13f3a4231c18&tuin=2853938518" class="service_left">-->

            <svg>
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#human"></use>
                </svg>
                <span>在线客服</span>
          <!--</a>-->
            </a>
            <a href="tel:4000214001" class="service_right">
                <svg>
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#phone"></use>
                </svg>
                <span>在线客服</span>
            </a>
        </section>
        <section class="hot_questions" v-if="serviceData">
            <h4 class="qustion_header">热门问题</h4>
            <ul>
                <li v-for="(item, index) in questionTitle" :key="index" class="question_title" @click="toQuestionDetail(item, index)">
                    <span>{{item}}</span>
                     <svg class="arrow-svg" fill="#999">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                    </svg>
                </li>
            </ul>
        </section>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
       <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>

  </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import {getService,getAccessToken,getCustom} from 'src/service/getData'
    import {mapState, mapMutations} from 'vuex'
    import axios from 'axios'
    import alertTip from 'src/components/common/alertTip'



    export default {
      data(){
            return{
                serviceData: null, //服务信息
                questionTitle: [], //问题标题
                questionDetail: [], //问题详情
                access_token:'',
                showAlert: false, //显示提示组件
                alertText: null, //提示的内容
            }
        },

        mounted(){
            this.initData(this.appid,this.secret);
        },
        mixins: [],
        components: {
            headTop,
            alertTip,

        },
        props:[],
        computed:{
          ...mapState([
            "appid","secret","userInfo","kf_account"
          ])
        },
        methods: {
            ...mapMutations([
                'SAVE_QUESTION'
            ]),
            closeTip(){
              this.showAlert = false;
            },
            //获取信息
            async initData(appid,secret){

//              var jsonp = require('jsonp');
//              jsonp('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret, null, function (err, data) {
//
//                if (err) {
//                  console.error(err.message);
//                } else {
//                  alert(1)
//                  console.log(data);
//                }
//              });

//              this.$jsonp('https://api.weixin.qq.com/cgi-bin/token',
//                { grant_type: 'client_credential',
//                  appid: appid,
//                  secret:secret
//                }).then(json => {
//                  console.info(json,'secret');
//                // Success.
//              }).catch(err => {
//                // Failed.
//              })


//            this.axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret, {

//
//              }).then(function (response) {
//              this.access_token = response.access_token;
//                })
//                .catch(function (error) {
//                  console.log(error);
//                });


              const res = await getAccessToken(appid,secret)

              this.access_token = res.result_text

//                this.serviceData = await getService();
//                Object.keys(this.serviceData).forEach(item => {
//                    let avoidRepeat = false;
//                    this.questionTitle.forEach((insertItem) => {
//                        //防止重复的数据，后台返回的数据有些是重复的
//                        if (insertItem == this.serviceData[item]) {
//                            avoidRepeat = true;
//                        }
//                    })
//                    //将标题和内容分别放进数组中
//                    if (item.indexOf('Caption') !== -1 && !avoidRepeat) {
//                            this.questionTitle.push(this.serviceData[item]);
//                    }else if(!avoidRepeat){
//                        this.questionDetail.push(this.serviceData[item]);
//                    }
//                })
            },
           tocustom(){
//             this.showAlert = true;
//             this.alertText = '改功能暂无开放';
//             return
              if(this.access_token){
                if(this.userInfo.openid){
                  getCustom(this.access_token,this.kf_account,this.userInfo.openid)

                }else{
                  this.showAlert = true;
                  this.alertText = '请登录';
                  return
                }
              }else {
                this.showAlert = true;
                this.alertText = '改功能暂无开放';
                return
              }
            },
            //保存问题详情
            toQuestionDetail(title, index){
                this.SAVE_QUESTION({title, detail: this.questionDetail[index]});
                this.$router.push('/service/questionDetail');
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .rating_page{
        background-color: #fff;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .service_connect{
        @include fj;
        a{
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 4rem;
            border-bottom: 1px solid #f5f5f5;
            svg{
                @include wh(1rem, 1rem);
            }
            span{
                margin-top: .4rem;
                @include sc(.6rem, #666);
            }
        }
        .service_left{
            border-right: 1px solid #f5f5f5;
        }
    }
    .hot_questions{
        .qustion_header{
            @include sc(.75rem, #333);
            line-height: 3rem;
            border-bottom: 1px solid #f5f5f5;
            padding-left: .7rem;
        }
        .question_title{
            padding: 0 .7rem;
            line-height: 2rem;
            border-bottom: 1px solid #f5f5f5;
            @include fj;
            align-items: center;
            span{
                @include sc(.6rem, #666);
            }
            svg{
                @include wh(.6rem, .6rem);
            }
        }
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
