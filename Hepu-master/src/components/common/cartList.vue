<template>
  <section class="buy_cart_container">
    <section @click="toggleCartList" class="cart_icon_num">

      <div class="cart_icon_container" :class="{cart_icon_activity: totalPrice > 0, move_in_cart:receiveInCart}" ref="cartContainer">
                <span v-if="totalNum" class="cart_list_length">
                    {{totalNum}}
                </span>
        <svg class="cart_icon">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
        </svg>
      </div>
      <div class="cart_num">
        <div>¥ {{totalPrice}}</div>
        <!--<div>配送费¥{{deliveryFee}}</div>-->
      </div>
    </section>
    <section class="gotopay" :class="{gotopay_acitvity: totalPrice > 0}">
      <span class="gotopay_button_style" v-if="totalPrice <= 0">去结算</span>
      <router-link v-else :to="{path:'/confirmOrder', query:{geohash, shopId,imgUrl:shopDetailData.photo,name:shopDetailData.name,totalPrice:totalPrice}}" class="gotopay_button_style">去结算</router-link>
    </section>
  </section>

  <transition name="toggle-cart">
    <section class="cart_food_list" v-show="showCartList&&cartFoodList.length">
      <header>
        <h4>购物车</h4>
        <div @click="clearCart">
          <svg>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
          </svg>
          <span class="clear_cart">清空</span>
        </div>
      </header>
      <section class="cart_food_details" id="cartFood">
        <ul>
          <li v-for="(item, index) in cartFoodList" :key="index" class="cart_food_li">
            <div class="cart_list_num">
              <p class="ellipsis">{{item.name}}</p>
              <p class="ellipsis">{{item.specs}}</p>
            </div>
            <div class="cart_list_price">
              <span>¥</span>
              <span>{{item.price}}</span>
            </div>
            <section class="cart_list_control">
                          <span @click="removeOutCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                              <svg>
                                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                              </svg>
                          </span>
              <span class="cart_num" v-if="item.num">{{item.num}}</span>
              <svg class="cart_add" @click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
              </svg>
            </section>
          </li>
        </ul>
      </section>
    </section>
  </transition>
  <transition name="fade">
    <div class="screen_cover" :class='{screen_hide: !showCartList}'  v-show="showCartList&&cartFoodList.length" @click="toggleCartList"></div>
  </transition>
</template>

<script>
  export default {
    data(){
      return{
        goods_id:"",
        geohash: '', //geohash位置信息
        foods:null, //商品详情
        shopId: null, //商店id值
        showMoveDot:[], //
        elLeft: 0, //当前点击加按钮在网页中的绝对top值
        elBottom: 0, //当前点击加按钮在网页中的绝对left值
        imgBaseUrl,
        menuList: [], //食品列表
        windowHeight: null, //屏幕的高度
        totalPrice: 0, //总共价格
        cartFoodList: [], //购物车商品列表
        showCartList: false,//显示购物车列表
        receiveInCart: false, //购物车组件下落的圆点是否到达目标位置
        shopDetailData: null, //商铺详情
        total:0,
      }
    },
    methods: {
      //监听圆点是否进入购物车
      listenInCart(){
        if (!this.receiveInCart) {
          this.receiveInCart = true;
          setTimeout(() => {
            this.receiveInCart = false;
          })
        }
      },
      //控制购物列表是否显示
      toggleCartList(){
        this.cartFoodList.length ? this.showCartList = !this.showCartList : true;
      },
      //清除购物车
      clearCart(){
        this.toggleCartList();
        this.CLEAR_CART(this.shopId);
      },
      //移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
      removeOutCart(category_id, item_id, food_id, name, price, specs){
        this.REDUCE_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
      },
      //显示下落圆球
      showMoveDotFun(showMoveDot, elLeft, elBottom){
        this.showMoveDot = [...this.showMoveDot, ...showMoveDot];
        this.elLeft = elLeft;
        this.elBottom = elBottom;
      },
      //加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
      addToCart(category_id, item_id, food_id, name, price, specs){
        this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
      },
      beforeEnter(el){
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
      },
      initCategoryNum(){
        let newArr = [];
        let cartFoodNum = 0;
        this.cartFoodList = [];
        this.menuList.forEach((item, index) => {
          if (this.shopCart && this.shopCart[this.foods.category_id]) {
            let num = 0;
            Object.keys(this.shopCart[this.foods.category_id]).forEach((itemid) => {
              Object.keys(this.shopCart[this.foods.category_id][itemid]).forEach((foodid) => {
                let foodItem = this.shopCart[this.foods.category_id][itemid][foodid];
                if (foodItem) {
                  num += foodItem.num;
                  this.foods.num = num;
                  this.totalPrice += foodItem.num * foodItem.price;
                  if (foodItem.num > 0) {
                    this.cartFoodList[cartFoodNum] = [];
                    this.cartFoodList[cartFoodNum].category_id = this.foods.category_id;
                    this.cartFoodList[cartFoodNum].item_id = itemid;
                    this.cartFoodList[cartFoodNum].food_id = foodid;
                    this.cartFoodList[cartFoodNum].num = foodItem.num;
                    this.foods.num = foodItem.num;
                    this.cartFoodList[cartFoodNum].price = foodItem.price;
                    this.cartFoodList[cartFoodNum].name = foodItem.name;
                    this.cartFoodList[cartFoodNum].specs = foodItem.specs;
                    cartFoodNum++;
                  }
                }
              })
            })
            newArr[index] = num;
          } else {
            newArr[index] = 0;
          }
        })
        this.totalPrice = this.totalPrice.toFixed(2);
        this.categoryNum = [...newArr];

      }
  }

  }
</script>

<style lang="scss" scoped>
  .buy_cart_container{
    position: fixed;
    background-color: #3d3d3f;
    bottom: 0;
    left: 0;
    z-index: 13;
    display: flex;
    @include wh(100%, 2rem);
    .cart_icon_num{
      flex: 1;
      .cart_icon_container{
        display: flex;
        background-color: #3d3d3f;
        position: absolute;
        padding: .4rem;
        border: 0.18rem solid #444;
        border-radius: 50%;
        left: .5rem;
        top: -.7rem;
        .cart_icon{
          @include wh(1.2rem, 1.2rem);
        }
        .cart_list_length{
          position: absolute;
          top: -.25rem;
          right: -.25rem;
          background-color: #ff461d;
          line-height: .7rem;
          text-align: center;
          border-radius: 50%;
          border: 0.025rem solid #ff461d;
          min-width: .7rem;
          height: .7rem;
          @include sc(.5rem, #fff);
          font-family: Helvetica Neue,Tahoma,Arial;
        }
      }
      .move_in_cart{
        animation: mymove .5s ease-in-out;
      }
      .cart_icon_activity{
        background-color: #559035;
      }
      .cart_num{
        @include ct;
        left: 3.5rem;

        div{
          color: #fff;
        }
        div:nth-of-type(1){
          font-size: .8rem;
          font-weight: bold;
          margin-bottom: .1rem;
        }
        div:nth-of-type(2){
          font-size: .4rem;
        }
      }
    }
    .gotopay{
      position: absolute;
      right: 0;
      background-color: #535356;
      @include wh(5rem, 100%);
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      .gotopay_button_style{
        @include sc(.7rem, #fff);
        font-weight: bold;
      }
    }
    .gotopay_acitvity{
      background-color: #ff8522;
    }
  }
  .cart_food_list{
    position: fixed;
    width: 100%;
    padding-bottom: 2rem;
    z-index: 12;
    bottom: 0;
    left: 0;
    background-color: #fff;
    header{
      @include fj;
      align-items: center;
      padding: .3rem .6rem;
      background-color: #eceff1;
      svg{
        @include wh(.6rem,.6rem);
        vertical-align: middle;
      }
      h4{
        @include sc(.7rem, #666);
      }
      .clear_cart{
        @include sc(.6rem, #666);
      }
    }
    .cart_food_details{
      background-color: #fff;
      max-height: 20rem;
      overflow-y: auto;
      .cart_food_li{
        @include fj;
        padding: .6rem .5rem;
        .cart_list_num{
          width: 55%;
          p:nth-of-type(1){
            @include sc(.7rem, #666);
            font-weight: bold;
          }
          p:nth-of-type(2){
            @include sc(.4rem, #666);
          }
        }
        .cart_list_price{
          font-size: 0;
          span:nth-of-type(1){
            @include sc(.6rem, #f60);
            font-family: Helvetica Neue,Tahoma;

          }
          span:nth-of-type(2){
            @include sc(.7rem, #f60);
            font-family: Helvetica Neue,Tahoma;
            font-weight: bold;
          }
        }
        .cart_list_control{
          display: flex;
          align-items: center;
          span{
            display: flex;
            align-items: center;
            justify-content: center;
          }
          svg{
            @include wh(.9rem, .9rem);
            fill: #559035;
          }
          .specs_reduce_icon{
            fill: #999;
          }
          .cart_num{
            @include sc(.65rem, #666);
            min-width: 1rem;
            text-align: center;
            font-family: Helvetica Neue,Tahoma;
          }
        }
      }
    }
  }
</style>
