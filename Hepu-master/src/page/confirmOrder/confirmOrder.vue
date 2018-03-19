<template>
    <div class="confirmOrderContainer">
        <section v-if="!showLoading">
            <head-top head-title="确认订单" goBack="true" signin-up='confirmOrder'></head-top>
            <router-link :to='{path: "/confirmOrder/chooseAddress", query: {id: 1}}' class="address_container">
                <div class="address_empty_left">
                    <svg class="location_icon">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
                    </svg>
                    <div class="add_address" v-if="!choosedAddress">请添加一个收货地址</div>
                    <div v-else class="address_detail_container">
                        <header>
                            <span>{{choosedAddress.shr}}</span>
                            <!--<span>{{choosedAddress.sex == 1? '先生':'女士'}}</span>-->
                            <span>{{choosedAddress.tel}}</span>
                        </header>
                        <div class="address_detail">
                            <!--<span v-if="choosedAddress.tag" :style="{backgroundColor: iconColor(choosedAddress.tag)}">{{choosedAddress.tag}}</span>-->
                            <p>{{choosedAddress.addr}}</p>
                        </div>
                    </div>
                </div>
                <svg class="address_empty_right">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
            </router-link>
            <!--<section class="delivery_model container_style">-->
                <!--<p class="deliver_text">送达时间</p>-->
                <!--<section class="deliver_time">-->
                    <!--<p>尽快送达 | 预计 {{checkoutData.delivery_reach_time}}</p>-->
                    <!--<p v-if="checkoutData.cart.is_deliver_by_fengniao">蜂鸟专送</p>-->
                <!--</section>-->
            <!--</section>-->
            <section class="pay_way container_style">
                <header class="header_style">
                    <span>支付方式</span>
                    <div class="more_type" @click="showPayWayFun">
                        <span>{{payWayname}}</span>
                        <svg class="address_empty_right">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                        </svg>
                    </div>
                </header>
                <!--<section class="hongbo">-->
                    <!--<span>红包</span>-->
                    <!--<span>暂时只在饿了么 APP 中支持</span>-->
                <!--</section>-->
            </section>
            <section class="food_list">
                <header v-if="imgUrl">
                    <img :src="imgBaseUrl + imgUrl">
                    <span>{{name}}</span>
                </header>
                <ul class="food_list_ul" v-if="cartInfo.length">
                    <li v-for="item in cartInfo" :key="item.id" class="food_item_style">
                        <p class="food_name ellipsis">{{item.name}}</p>
                        <div class="num_price">
                            <span>x {{item.quantity}}</span>
                            <span>¥{{item.price}}</span>
                        </div>
                    </li>
                </ul>
                <!--<div class="food_item_style" v-if="checkoutData.cart.extra">-->
                    <!--<p class="food_name ellipsis">{{checkoutData.cart.extra[0].name}}</p>-->
                    <!--<div class="num_price">-->
                        <!--<span></span>-->
                        <!--<span>¥ {{checkoutData.cart.extra[0].price}}</span>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div class="food_item_style">-->
                    <!--<p class="food_name ellipsis">配送费</p>-->
                    <!--<div class="num_price">-->
                        <!--<span></span>-->
                        <!--<span>¥ {{checkoutData.cart.deliver_amount || 0}}</span>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div class="food_item_style total_price">-->
                    <!--<p class="food_name ellipsis">订单 ¥{{checkoutData.cart.total}}</p>-->
                    <!--<div class="num_price">-->
                        <!--<span>待支付 ¥{{checkoutData.cart.total}}</span>-->
                    <!--</div>-->
                <!--</div>-->
            </section>
            <section class="pay_way container_style">
                <!--<router-link :to='{path: "/confirmOrder/remark", query: {id: checkoutData.cart.id, sig: checkoutData.sig}}' class="header_style">-->
                    <!--<span>订单备注</span>-->
                    <!--<div class="more_type">-->
                        <!--<span class="ellipsis">{{remarkText||inputText? remarklist: '口味、偏好等'}}</span>-->
                        <!--<svg class="address_empty_right">-->
                            <!--<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>-->
                        <!--</svg>-->
                    <!--</div>-->
                <!--</router-link>-->
                <!--<router-link :to="checkoutData.invoice.is_available? '/confirmOrder/invoice': ''" class="hongbo" :class="{support_is_available: checkoutData.invoice.is_available}">-->
                    <!--<span>发票抬头</span>-->
                    <!--<span>-->
                        <!--{{checkoutData.invoice.status_text}}-->
                        <!--<svg class="address_empty_right">-->
                            <!--<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>-->
                        <!--</svg>-->
                    <!--</span>-->
                <!--</router-link>-->
            </section>
            <section class="confrim_order">
                <p>待支付 ¥{{totalPrice}}</p>
                <p @click="confrimOrder">确认下单</p>
            </section>
            <transition name="fade">
                <div class="cover" v-if="showPayWay" @click="showPayWayFun"></div>
            </transition>
            <transition name="slid_up">
                <div class="choose_type_Container" v-if="showPayWay">
                    <header>支付方式</header>
                    <ul>
                        <li v-for="item in payments" :key="item.id" :class="{choose: payWayId == item.id}">
                            <span>{{item.name}}<span>{{item.description}}</span></span>
                            <svg class="address_empty_right" @click="choosePayWay(item.name, item.id)">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
                            </svg>
                        </li>
                    </ul>
                </div>
            </transition>
        </section>
        <loading v-if="showLoading"></loading>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import headTop from 'src/components/header/head'
    import alertTip from 'src/components/common/alertTip'
    import loading from 'src/components/common/loading'
    import {checkout, getAddress, placeOrders, getAddressList} from 'src/service/getData'
    import {imgBaseUrl,baseUrl} from 'src/config/env'
    import axios from 'axios'
    export default {
        data(){
          return {
            shopId: null, //商店id值
            showLoading: true, //显示加载动画
            checkoutData: null,//数据返回值
            shopCart: null,//购物车数据
            imgBaseUrl, //图片域名
            showPayWay: false,//显示付款方式
            payWayId: 1, //列表上付款方式
            showAlert: false, //弹出框
            alertText: null, //弹出框内容,
            cartInfo:[],  // 购物车数据
            imgUrl:"",  //
            name:"",
            payWayname:"在线支付",
            totalPrice:0, // 总价格
            payments:
              [
                {
                  select_state: -1,
                  name: "在线支付",
                  id: 1,
                  disabled_reason: "",
                  description: "（商家支持在线支付）"
                },
                {
                  select_state: 1,
                  name: "线下支付",
                  id: 2,
                  disabled_reason: "",
                  description: "（商家支持线下支付）"
                }
              ]
          }
        },
        created(){
//            document.title = '确认订单';

            //获取上个页面传递过来的geohash值
            this.geohash = this.$route.query.geohash;
            this.imgUrl = this.$route.query.imgUrl;
            this.name = this.$route.query.name;
            this.totalPrice = this.$route.query.totalPrice;

            //获取上个页面传递过来的shopid值
            this.shopId = this.$route.query.shopId;
            this.INIT_BUYCART();
            this.SAVE_SHOPID(this.shopId);
            //获取当前商铺购物车信息 这里是获取购物车缓存的    而你的订单列表数据没有在购物车缓存中  有没有单独获取
            this.shopCart = this.cartList[this.shopId];
            //checkoutData.payments
        },
        mounted(){
          this.initData();
          if (!(this.userInfo && this.userInfo.user_id)) {
              this.showAlert = true;
              this.alertText = '您还没有登录';
          }
        },
        components: {
            headTop,
            alertTip,
            loading,
        },
        computed: {
          ...mapState([
              'cartList', 'remarkText', 'inputText', 'invoice', 'choosedAddress', 'userInfo'
          ]),
          //备注页返回的信息进行处理
          remarklist: function (){
              let str = new String;
              if (this.remarkText) {
                  Object.values(this.remarkText).forEach(item => {
                      str += item[1] + '，';
                  })
              }
              //是否有自定义备注，分开处理
              if (this.inputText) {
                  return str + this.inputText;
              }else{
                  return str.substr(0, str.lastIndexOf('，')) ;
              }
          },
        },
        methods: {
            ...mapMutations([
                'INIT_BUYCART', 'SAVE_GEOHASH', 'CHOOSE_ADDRESS', 'NEED_VALIDATION', 'SAVE_CART_ID_SIG', 'SAVE_ORDER_PARAM', 'ORDER_SUCCESS', 'SAVE_SHOPID'
            ]),
            //初始化数据
            async initData(){
                let newArr = new Array;
                console.log(this.shopCart);// this。shopCart是个undefined；往下执行回报错；
                if(this.shopCart){
                  Object.values(this.shopCart).forEach(categoryItem => {
                    Object.values(categoryItem).forEach(itemValue=> {
                      Object.values(itemValue).forEach(item => {
                        newArr.push({
                          id: item.id,
                          name: item.name,
//                                packing_fee: item.packing_fee,
                          price: item.price,
                          quantity: item.num,
//                                sku_id: item.sku_id,
//                                specs: [item.specs],
                          stock: item.stock,
                        })
                      })
                    })
                  })
                }
                this.cartInfo = newArr;
                //检验订单是否满足条件
//                this.checkoutData = await checkout(this.geohash, [newArr], this.shopId);
//                this.SAVE_CART_ID_SIG({cart_id: this.checkoutData.cart.id, sig:  this.checkoutData.sig})
//                this.initAddress();
                this.showLoading = false;
            },
            //获取地址信息，第一个地址为默认选择地址
            async initAddress(){
                if (this.userInfo && this.userInfo.user_id) {
                    const addressRes = await getAddressList(this.userInfo.user_id);
                    if (addressRes instanceof Array && addressRes.length) {
                        this.CHOOSE_ADDRESS({address: addressRes[0], index: 0});
                    }
                }
            },
            //显示付款方式
            showPayWayFun(){
                this.showPayWay = !this.showPayWay;
            },
            //选择付款方式
            choosePayWay(name, id){
               this.payWayname = name;
               this.payWayId = id;
            },
//            //地址备注颜色
//            iconColor(name){
//                switch(name){
//                    case '公司': return '#ff8522';
//                    case '学校': return '#559035';
//                }
//            },
            //确认订单
            async confrimOrder(){
                //用户未登录时弹出提示框
                if (!(this.userInfo && this.userInfo.user_id)) {
                    this.showAlert = true;
                    this.alertText = '请登录';
                    this.$router.push('/login');
                    //未选择地址则提示
                }else if(!this.choosedAddress){
                    this.showAlert = true;
                    this.alertText = '请添加一个收货地址';
                    return
                }
                //保存订单
                this.SAVE_ORDER_PARAM({
                    user_id: this.userInfo.user_id,
//                    cart_id: this.checkoutData.cart.id,
                    address_id: this.choosedAddress.id,
                    entities: this.cartInfo,
                });
//                console.info(this.userInfo.user_id, this.cartInfo, this.choosedAddress.id)
                //发送订单信息
//               this.cartInfo = '';
//               this.cartInfo = window.encodeURI(window.encodeURI(this.cartInfo)); 　　//编码
//              this.cartInfo = '//{}//'
//              this.cartInfo = decodeURI(this.cartInfo);

//              this.axios.post(baseUrl+'jpnk/snjpnk', {
//                actiontype:'jpnk_placeOrders',
//                shop_id: this.shopId,
//                user_id: this.userInfo.user_id,
//                cartInfo:this.cartInfo,
//                addr_id:this.choosedAddress.id
//              }).then(function (response) {
//                  console.log(response,'okkkkkkkk');
//                })
//                .catch(function (error) {
//                  console.log(error);
//                });

              console.info('typeof',this.cartInfo);

              let orderRes = await placeOrders(this.shopId,this.userInfo.user_id, this.cartInfo, this.choosedAddress.id,this.payWayId);

              if(orderRes.result === '1' && this.payWayId === 1){
                this.ORDER_SUCCESS(orderRes);
                this.$router.push('/confirmOrder/payment');
              }else if(orderRes.result === '1' && this.payWayId === 2){
                this.showAlert = true;
                this.alertText = "联系我们客服,线下支付";
                this.$router.push('/order');
              }else {
                this.showAlert = true;
                this.alertText = orderRes.result_text;
              }
              //第一次下单的手机号需要进行验证，否则直接下单成功
//                if (orderRes.need_validation) {
//                    this.NEED_VALIDATION(orderRes);
//                    this.$router.push('/confirmOrder/userValidation');
//                }else{
//                    this.ORDER_SUCCESS(orderRes);
//                    this.$router.push('/confirmOrder/payment');
//                }
            },
        },
        watch: {
            userInfo: function (value) {
                if (value && value.user_id) {
                    this.initAddress();
                }
            },

        }
    }

</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .confirmOrderContainer{
        padding-top: 1.95rem;
        padding-bottom: 3rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .container_style{
        background-color: #fff;
        margin-top: .4rem;
        padding: 0 .7rem;
    }
    .address_container{
        min-height: 3.5rem;
        @include fj;
        align-items: center;
        padding: 0 0.6rem;
        background: url(../../images/address_bottom.png) left bottom repeat-x;
        background-color: #fff;
        background-size: auto .12rem;
        .address_empty_left{
            display: flex;
            align-items: center;
            .location_icon{
                @include wh(.8rem, .8rem);
                fill: $blue;
                margin-right: .2rem;
            }
            .add_address{
                @include sc(.7rem, #333);
            }
            .address_detail_container{
                margin-left: .2rem;
                header{
                    @include sc(.65rem, #333);
                    span:nth-of-type(1){
                        font-size: .8rem;
                        font-weight: bold;
                    }
                }
                .address_detail{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    span{
                        @include sc(.5rem, #fff);
                        border-radius: .15rem;
                        background-color: #ff5722;
                        height: .6rem;
                        line-height: .6rem;
                        padding: 0 .2rem;
                        margin-right: .3rem;
                    }
                    p{
                        @include sc(.55rem, #777);
                    }
                }
            }
        }
    }
    .address_empty_right{
        @include wh(.6rem, .6rem);
        fill: #999;
    }
    .delivery_model{
        border-left: .2rem solid $blue;
        min-height: 4rem;
        @include fj;
        align-items: center;
        .deliver_text{
            @include sc(.8rem, #333);
            font-weight: bold;
            padding-left: .3rem;
        }
        .deliver_time{
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            p:nth-of-type(1){
                @include sc(.7rem, $blue);
            }
            p:nth-of-type(2){
                @include sc(.5rem, #fff);
                background-color: $blue;
                width: 2.4rem;
                margin-top: .5rem;
                text-align: center;
                border-radius: 0.12rem;
                padding: .1rem;
            }
        }
    }
    .pay_way{
        .header_style{
            @include fj;
            line-height: 2rem;
            span:nth-of-type(1){
                @include sc(.7rem, #666);
            }
            .more_type{
                span:nth-of-type(1){
                    @include sc(.6rem, #aaa);
                    width: 10rem;
                    display: inline-block;
                    text-align: right;
                    vertical-align: middle;
                }
                svg{
                    @include wh(.5rem, .5rem);
                    fill: #ccc;
                }
            }
        }
        .hongbo{
            @include fj;
            border-top: 0.025rem solid #f5f5f5;
            span{
                @include sc(.6rem, #aaa);
                line-height: 2rem;
                svg{
                    @include wh(.5rem, .5rem);
                    vertical-align: middle;
                    fill: #ccc;
                }
            }
            span:nth-of-type(2){
                color: #aaa;
            }
        }
        .support_is_available{
            span{
                color: #666;
            }
        }
    }
    .food_list{
        background-color: #fff;
        margin-top: .4rem;
        header{
            padding: .7rem;
            border-bottom: 0.025rem solid #f5f5f5;
            img{
                @include wh(1.2rem, 1.2rem);
                vertical-align: middle;
            }
            span{
                @include sc(.8rem, #333);
            }
        }
        .food_list_ul{
            padding-top: .5rem;
        }
        .food_item_style{
            @include fj;
            line-height: 1.8rem;
            padding: 0 .7rem;
            span,p{
                @include sc(.65rem, #666);
            }
            .food_name{
                width: 11rem;
            }
            .num_price{
                flex: 1;
                @include fj;
                align-items: center;
                span:nth-of-type(1){
                    color: #f60;
                }
            }
        }
        .total_price{
            border-top: 0.025rem solid #f5f5f5;
        }
    }
    .confrim_order{
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 2rem;
        p{
            line-height: 2rem;
            @include sc(.75rem, #fff);
        }
        p:nth-of-type(1){
            background-color: #3c3c3c;
            flex: 5;
            padding-left: .7rem;
        }
        p:nth-of-type(2){
            flex: 2;
            background-color: #ff8522;
            text-align: center;
        }
    }
    .cover{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0,0,0,.3);
        z-index: 203;
    }
    .choose_type_Container{
        min-height: 10rem;
        background-color: #fff;
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 204;
        header{
            background-color: #fafafa;
            @include sc(.7rem, #333);
            text-align: center;
            line-height: 2rem;
        }
        ul{
            li{
                @include fj;
                padding: 0 .7rem;
                line-height: 2.5rem;
                align-items: center;
                span{
                    @include sc(.7rem, #ccc);
                }
                svg{
                    @include wh(.8rem, .8rem);
                    fill: #eee;
                }
            }
            .choose{
                span{
                    color: #333;
                }
                svg{
                    fill: #ff8522;
                }
            }
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
    .slid_up-enter-active, .slid_up-leave-active {
        transition: all .3s;
    }
    .slid_up-enter, .slid_up-leave-active {
        transform: translate3d(0,10rem,0)
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
