<template>
  <div class="rating_page">
    <!--<head-top :head-title="foods.name" go-back='true'></head-top>-->
    <section class="header_img">
      <img :src="imgBaseUrl + foods.photo" class="food_img">
      <div class="cover"></div>
    </section>
    <!--<p class="description">{{foods.shop_name}}</p>-->
    <section class="detail_container">
      <section class="detail_left" >
        <p>{{foods.desc}}{{foods.more_desc}} </p>
        <!--{{foods.desc}}-->
        <!--吉林省和龙市 有机富硒米300斤/年 (按季配送)-->
        <div class="rating_sale active">

          <!--<span>[春节活动]</span>-->
          <!--<span>截止日期2018年2月15日</span>-->

          <!--<rating-star :rating='rating'></rating-star>-->
          <!--<span>{{ goodsDetail.price.toFixed(1)}}</span>-->
        </div>
        <!--<p>-->
        <!--<span>月售 {{month_sales}}单</span>-->
        <!--<span>售价 ¥{{foods.specfoods[0].price}}</span>-->
        <!--<span v-if="foods.specfoods.length">起</span>-->
        <!--</p>-->
        <!--<p>-->
        <!--<span>评论数 {{rating_count}}</span>-->
        <!--<span>好评率 {{satisfy_rate}}%</span>-->
        <!--</p>-->
        <!--<p>-->

          <!--<span>好评率 {{satisfy_rate}}%</span>-->
        <!--</p>-->

        <div class="cart_list_price cart_left " v-if="foods.unit=='亩'">
          <span>¥{{foods.member_price}}/年</span>
          <!--<span>¥{{foods.price}}/年</span>-->

        </div>
        <div class="cart_list_price cart_left " v-else>
          <span>¥{{foods.member_price}}/{{foods.unit}}</span>
          <!--<span>¥{{foods.price}}/{{foods.unit}}</span>-->

        </div>


        <div class="cart_right">
          <buy-cart :shopId='shopId' :foods='foods' @moveInCart="listenInCart" @showMoveDot="showMoveDotFun"></buy-cart>
        </div>
        <div>
          <span class="buy_again">有机</span>
          <span class="buy_again">吉林延边</span>
        </div>

      </section>
    </section>
    <div class="hr"></div>

    <div class="info">
      <p class="cap_shop"><i class="fa fa-truck"></i>和璞献鲜 <span>官方</span></p>
      <p class="cap_tag"><i class="fa fa-check-square-o"></i>官网认证 <i class="fa fa-check-square-o"></i>担保交易</p>
    </div>


    <transition appear
                @after-appear = 'afterEnter'
                @before-appear="beforeEnter"
                v-for="(item,index) in showMoveDot">
            <span class="move_dot" v-if="item">
                <svg class="move_liner">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                </svg>
            </span>
    </transition>

  </div>
</template>

<script>
  import headTop from 'src/components/header/head'
  import {getImgPath} from 'src/components/common/mixin'
  import ratingStar from 'src/components/common/ratingStar'
  import buyCart from 'src/components/common/buyCart'
  import {imgBaseUrl} from 'src/config/env'
  import { goodDetails } from "src/service/getData"
  import {mapState, mapMutations} from 'vuex'

  export default {
    data(){
      return{
        goods_id:"",
        foods:null, //商品详情
        shopId: null, //商店id值
        showMoveDot:[], //
        elLeft: 0, //当前点击加按钮在网页中的绝对top值
        elBottom: 0, //当前点击加按钮在网页中的绝对left值
        imgBaseUrl,
        windowHeight: null, //屏幕的高度
        totalPrice: 0, //总共价格
        cartFoodList:[],
      }
    },
    created(){
      this.goods_id = this.$route.query.goods_id;
      this.shopId = this.$route.query.shopId;
      this.flag = this.$route.query.flag;

      this.foods = {
        category_id : this.$route.query.category_id,
        key : this.$route.query.key,
        name : this.$route.query.name,
        stock : this.$route.query.stock,
        photo:this.$route.query.photo,
        desc:this.$route.query.desc,
        price:this.$route.query.price,
        member_price:this.$route.query.member_price,
        more_desc:this.$route.query.more_desc,
        unit:this.$route.query.unit,
      }
    },
    async mounted(){
      let res = await goodDetails(this.goods_id);
      if(res.result == "1"){
        this.foods = Object.assign(this.foods,res.data[0])
      }
      this.windowHeight = window.innerHeight;
      this.initCategoryNum()
    },
    computed:{
      ...mapState([
        'cartList'
      ]),
      //当前商店购物信息
      shopCart: function (){
        return {...this.cartList[this.shopId]};
      },
    },
    mixins: [getImgPath],
    components: {
      headTop,
      ratingStar,
      buyCart,
    },
    props:[],
    methods: {
      ...mapMutations([
        'RECORD_ADDRESS','ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART','RECORD_SHOPDETAIL'
      ]),
      /**
       * 初始化和shopCart变化时，重新获取购物车改变过的数据，赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
       */
      initCategoryNum(){
        let newArr = [];
        let cartFoodNum = 0;
        this.totalPrice = 0;
        this.cartFoodList = [];
        if(this.shopCart && this.shopCart[this.foods.category_id]){
          let num = 0;
          Object.keys(this.shopCart[this.foods.category_id]).forEach((itemid) => {
            Object.keys(this.shopCart[this.foods.category_id][itemid]).forEach((foodid) => {
              let foodItem = this.shopCart[this.foods.category_id][itemid][foodid];
              if(foodItem){
                num += foodItem.num;
                this.foods.num = num;
                this.totalPrice += foodItem.num*foodItem.price;
                if(foodItem.num > 0){
                  this.cartFoodList[cartFoodNum] = [];
                  this.cartFoodList[cartFoodNum].category_id = this.foods.category_id;
                  this.cartFoodList[cartFoodNum].item_id = itemid;
                  this.cartFoodList[cartFoodNum].food_id = foodid;
                  this.cartFoodList[cartFoodNum].num = foodItem.num;
                  this.foods.num = foodItem.num;
                  this.cartFoodList[cartFoodNum].price = foodItem.price;
                  this.cartFoodList[cartFoodNum].name = foodItem.name;
                  this.cartFoodList[cartFoodNum].specs = foodItem.specs;
                  cartFoodNum ++;
                }
              }

            })
          })
        }
        this.totalPrice = this.totalPrice.toFixed(2);
      },
      //监听圆点是否进入购物车
      listenInCart(){
        if (!this.receiveInCart) {
          this.receiveInCart = true;
          setTimeout(() => {
            this.receiveInCart = false;
          })

        }
      },
      //显示下落圆球
      showMoveDotFun(showMoveDot, elLeft, elBottom){
        console.log(elLeft, elBottom);
        this.showMoveDot = [...this.showMoveDot, ...showMoveDot];
        this.elLeft = elLeft;
        this.elBottom = elBottom;
      },
      beforeEnter(el){
        console.log(this.elBottom - this.windowHeight);
        el.style.transform = `translate3d(0,${37 + this.elBottom - this.windowHeight}px,0)`;
        el.children[0].style.transform = `translate3d(${this.elLeft - 30}px,0,0)`;
        el.children[0].style.opacity = 0;
      },
      afterEnter(el){
        el.style.transform = `translate3d(0,0,0)`;
        el.children[0].style.transform = `translate3d(0,0,0)`;
        el.style.transition = 'transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)';
        el.children[0].style.transition = 'transform .55s linear';
        this.showMoveDot = this.showMoveDot.map(item => false);
        el.children[0].style.opacity = 1;
        el.children[0].addEventListener('transitionend', () => {
          this.listenInCart();
        });
        el.children[0].addEventListener('webkitAnimationEnd', () => {
          this.listenInCart();
        })
      }

    },
    watch: {
      shopCart: function (value){
        this.initCategoryNum();
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';
  @import "~font-awesome/css/font-awesome.css";

  .rating_page{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #F5F5F5;
    z-index: 10;
    /*padding-top: 1.95rem;*/
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .header_img{
    position: relative;
    .food_img{
      width: 100%;
      height: 309px;
      display: block;

    }
    .cover{
      position: absolute;
      @include wh(100%, 100%);
      top: 0;
      left: 0;
    }
  }
  .info{
    background: #fff;
    padding: .3rem .3rem 2.3rem .3rem;
    .cap_shop{
      line-height: 2rem;
      i{
        font-size: .8rem;
        margin-right: .2rem;
        color: #333;
      }
      span{
        background: #f44;
        padding: 0rem .2rem 0 .2rem;
        @include sc(.6rem, #fff);
        border-radius: .1rem;
      }
      @include sc(.7rem, #333);
    }
    .cap_tag{
      line-height: 2rem;
      i{
        font-size: .6rem;
        color: rgb(54,206,76);
        margin-right: .2rem;
      }
      i:last-child{
        margin-left: .2rem;
      }
    }
    p{
      border-bottom: .001rem solid #e5e5e5;
      @include sc(.6rem, #666);
    }
  }
  .img{
    @include sc(1rem, #666);
    width: 9rem;
    height: auto;
  }
  .hr{
    width: 100%;
    height: .7rem;
    background: #F5F5F5;
  }

  .dec{
    background: #fff;
    text-align: center;
  }

  .description{
    @include sc(.6rem, #666);
    margin-top: .5rem;
    line-height: .8rem;
    bottom: .2rem;
    padding: 0 .5rem;
  }
  .moredesc{
    width: 12rem;
    @include sc(.5rem, #666);
    margin-top: .5rem;
    line-height: 1.4rem;
    bottom: .2rem;
    font-size: 0.6rem;
    padding: 0 .5rem;
  }
  .detail_container{
    background: #fff;
    padding: .5rem;
    @include fj;
    align-items: center;
    .detail_left{
      p:nth-of-type(1){
        @include sc(.7rem, #333);
        margin-bottom: .2rem;
        font-weight: bold;
      }
      .buy_again{
        @include sc(.55rem, #559035);
        border: 0.025rem solid #3190e8;
        padding: .1rem .2rem;
        border-radius: .15rem;
        color: #3190e8 !important;
      }
      .cart_list_price{
        margin-top: 10px;
        font-size: 0;
        span{
          display: block;
        }
        span:nth-of-type(1){
          @include sc(.7rem, #f60);
          font-family: Helvetica Neue,Tahoma;
          font-weight: bold;
        }
        span:nth-of-type(2){
          @include sc(.6rem, #B3B3B3);
          text-decoration:line-through;
          font-family: Helvetica Neue,Tahoma;
          font-weight: bold;
        }


      }
      .cart_left{
        display: inline-block;
      }
      .cart_right{
        display: inline-block;
        position: absolute;
        right: 1rem;
      }
      .rating_sale{
        display: flex;
        align-items: center;
        span{
          font-family: 'Helvetica Neue',Tahoma,Arial;
        }
        span:nth-of-type(1){
          @include sc(.4rem, #BF2236);
          font-weight: bold;
          margin-right: .3rem;
        }
        span:nth-of-type(2){
          @include sc(.4rem, #B3B3B3);
          margin-right: .05rem;
        }

        span:nth-of-type(3){
          @include sc(.7rem, #f60);
          font-weight: bold;
        }
      }
      p:nth-of-type(2){
        font-size: 0;
        margin-top: .3rem;
        span:nth-of-type(1){
          @include sc(.6rem, #666);
          margin-right: .4rem;
        }
        span:nth-of-type(2),span:nth-of-type(3){
          @include sc(.6rem, #f60);
          margin-right: .2rem;
        }
      }
      p:nth-of-type(3){
        span{
          @include sc(.6rem, #666);
        }
      }
    }
  }

  .move_dot{
    position: fixed;
    bottom: 30px;
    left: 30px;

    svg{
      @include wh(.9rem, .9rem);
      fill: #559035;
    }
  }

</style>
