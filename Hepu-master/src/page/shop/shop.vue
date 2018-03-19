<template>
  <div>
    <section v-if="!showLoading" class="shop_container">
      <nav class="goback" @click="goback">
        <svg width="4rem" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:3"/>
        </svg>
      </nav>
      <header class="shop_detail_header" ref="shopheader" :style="{zIndex: showActivities? '14':'10'}">
        <img :src="imgBaseUrl + shopDetailData.logo" class="header_cover_img">
        <section class="description_header">
          <router-link to="/shop/shopDetail" class="description_top">
            <section class="description_left">
              <img :src="imgBaseUrl + shopDetailData.logo">
            </section>
            <section class="description_right">
              <h4 class="description_title ellipsis">{{shopDetailData.name}}</h4>
              <p class="description_text">{{shopDetailData.province}} , {{shopDetailData.city}} </p>
              <p class="description_promotion ellipsis">公告：{{shopDetailData.desc}}</p>
            </section>
            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description_arrow" >
              <path d="M0 0 L8 7 L0 14"  stroke="#fff" stroke-width="1" fill="none"/>
            </svg>
          </router-link>
        </section>
      </header>
      <transition name="fade">
        <section class="activities_details" v-if="showActivities">
          <h2 class="activities_shoptitle">{{shopDetailData.name}}</h2>
          <h3 class="activities_ratingstar">
            <rating-star :rating='shopDetailData.rating'></rating-star>
          </h3>
          <section class="activities_list">
            <header class="activities_title_style"><span>优惠信息</span></header>
            <ul>
              <li v-for="item in shopDetailData.activities" :key="item.id">
                <span class="activities_icon" :style="{backgroundColor: '#' + item.icon_color, borderColor: '#' + item.icon_color}">{{item.icon_name}}</span>
                <span>{{item.description}}（APP专享）</span>
              </li>
            </ul>
          </section>
          <section class="activities_shopinfo">
            <header class="activities_title_style"><span>商家公告</span></header>
            <p>{{promotionInfo}}</p>
          </section>
          <svg width="60" height="60" class="close_activities" @click.stop="showActivitiesFun">
            <circle cx="30" cy="30" r="25" stroke="#555" stroke-width="1" fill="none"/>
            <line x1="22" y1="38" x2="38" y2="22" style="stroke:#999;stroke-width:2"/>
            <line x1="22" y1="22" x2="38" y2="38" style="stroke:#999;stroke-width:2"/>
          </svg>
        </section>
      </transition>
      <section class="change_show_type" ref="chooseType">
        <div>
          <span :class='{activity_show: changeShowType =="food"}' @click="changeShowType='food'">产品</span>
        </div>
        <div>
          <span :class='{activity_show: changeShowType =="rating"}' @click="changeShowType='rating'">权益</span>
        </div>
      </section>
      <transition name="fade-choose">
        <section v-show="changeShowType =='food'" class="food_container">
          <section class="menu_container">
            <section class="menu_left" id="wrapper_menu" ref="wrapperMenu">
              <ul>
                <li v-for="(item,index) in menuList" :key="index" class="menu_left_li" :class="{activity_menu: index == currentIndex}" @click="selectMenu(index,$event)">
                  <img :src="getImgPath(item.icon_url)" v-if="item.icon_url">
                  <span>{{item.products_type}}</span>
                  <span class="category_num" v-if="categoryNum[index]&&item.type==1">{{categoryNum[index]}}</span>
                </li>
              </ul>
            </section>
            <section class="menu_right" ref="menuFoodList">
              <ul >
                <li v-for="(item,index) in menuList" :key="index"  class="food-list-hook">
                  <header class="menu_detail_header">
                    <section class="menu_detail_header_left">
                      <strong class="menu_item_title">{{item.products_type}}</strong>
                      <span class="menu_item_description">{{item.description}}</span>
                    </section>
                  </header>
                  <section v-for="(foods,foodindex) in item.dataproducts" :key="foodindex" class="menu_detail_list">

                    <router-link :to="{path: 'shop/foodDetail', query:{shopId:shopId,goods_id:foods.product_no,category_id:foods.category_id,key:foods.key,name:foods.name,stock:foods.stock,photo:foods.photo,desc:foods.desc,price:foods.price,member_price:foods.member_price}}" tag="div" class="menu_detail_link">
                      <section class="menu_food_img">
                        <img :src="imgBaseUrl + foods.photo">
                      </section>
                      <section class="menu_food_description">
                        <h3 class="food_description_head">
                          <strong class="description_foodname">{{foods.name}}</strong>


                          <!--<ul v-if="foods.attributes.length" class="attributes_ul">-->
                          <!--<li v-for="(attribute, foodindex) in foods.attributes" :key="foodindex" :style="{color: '#' + attribute.icon_color,borderColor:'#' +attribute.icon_color}" :class="{attribute_new: attribute.icon_name == '新'}">-->
                          <!--<p :style="{color: attribute.icon_name == '新'? '#fff' : '#' + attribute.icon_color}">{{attribute.icon_name == '新'? '新品':attribute.icon_name}}</p>-->
                          <!--</li>-->
                          <!--</ul>-->

                        </h3>
                        <div class="food_price" v-if="foods.unit=='亩'">
                          <span>¥{{foods.member_price}}/年</span>
                          <!--<span>¥{{foods.price}}/年</span>-->
                        </div>
                        <div class="food_price" v-else>
                          <span>¥{{foods.member_price}}/{{foods.unit}}</span>
                          <!--<span>¥{{foods.price}}/{{foods.unit}}</span>-->
                        </div>

                        <!--<p class="food_description_content">{{foods.description}}</p>-->
                        <!--<p class="food_description_sale_rating">-->
                        <!--<span class="active">春节活动截止日期2018年2月15日</span>-->
                        <!--&lt;!&ndash;<span>好评率{{foods.satisfy_rate}}%</span>&ndash;&gt;-->
                        <!--</p>-->
                        <!--<p v-if="foods.activity" class="food_activity">-->
                        <!--<span :style="{color: '#' + foods.activity.image_text_color,borderColor:'#' +foods.activity.icon_color}">{{foods.activity.image_text}}</span>-->
                        <!--</p>-->
                      </section>
                    </router-link>
                    <footer class="menu_detail_footer">
                      <section class="active">
                        <!--<span>[春节活动]</span>-->
                        <!--<span>截止日期2018年2月15日</span>-->
                      </section>
                      <buy-cart :shopId='shopId' :foods='foods' @moveInCart="listenInCart" @showChooseList="showChooseList" @showReduceTip="showReduceTip" @showMoveDot="showMoveDotFun"></buy-cart>

                    </footer>
                  </section>
                </li>
              </ul>
            </section>
          </section>
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
        </section>
      </transition>
      <transition name="fade-choose">
        <section class="rating_container" id="ratingContainer" v-show="changeShowType =='rating'">
          <section v-load-more="loaderMoreRating" type="2">
            <section>
              <ul class="rating_list_ul">
                <li class="rating_list_li">
                  <section class="rating_details ">
                    <p class="rating_list_title "><i class="fa fa-diamond yz"></i> 银钻会员（认养稻田1亩）</p>
                    <!--<p class="pj_name_ul">19年当地野山参一支(¥3000以上/支)</p>-->
                    <!--<p class="pj_name_ul">延边黄牛肉10斤(¥100/斤)</p>-->
                    <!--<p class="pj_name_ul">长寿之乡矿泉水5箱(¥120/箱)</p>-->
                  </section>
                </li>
                <li class="rating_list_li">
                  <section class="rating_details ">
                    <p class="rating_list_title "><i class="fa fa-diamond jz"></i> 金钻会员（认养稻田2-3亩）</p>
                    <!--<p class="pj_name_ul">19年当地野山参一支(¥3000以上/支)</p>-->
                    <!--<p class="pj_name_ul">延边黄牛肉20斤(¥100/斤)</p>-->
                    <!--<p class="pj_name_ul">长寿之乡矿泉水5箱(¥120/箱)</p>-->
                  </section>
                </li>
                <li class="rating_list_li">
                  <section class="rating_details ">
                    <p class="rating_list_title"><i class="fa fa-diamond bz"></i> 铂金会员（认养稻田4-5亩）</p>
                    <!--<p class="pj_name_ul">19年当地野山参一支(¥3000以上/支)</p>-->
                    <!--<p class="pj_name_ul">延边黄牛肉20斤(¥100/斤)</p>-->
                    <!--<p class="pj_name_ul">长寿之乡矿泉水10箱(¥120/箱)</p>-->
                  </section>
                </li>
                <li class="rating_list_li">
                  <section class="rating_details ">
                    <p class="rating_list_title"> <i class="fa fa-diamond zz"></i> 至尊会员（认养稻田5亩以上）</p>
                    <!--<p class="pj_name_ul">19年当地野山参一支(¥3000以上/支)</p>-->
                    <!--<p class="pj_name_ul">延边黄牛肉20斤(¥100/斤)</p>-->
                    <!--<p class="pj_name_ul">长寿之乡矿泉水20箱(¥120/箱)</p>-->
                    <img class="certificate" src="../../images/zszz.jpg" alt="">
                  </section>
                </li>
                <li class="rating_list_li">
                  <router-link class="rating_text" :to="{path:'shop/protocolDetail'}">
                    <p class="look">
                      点击查看 <span class="ry"> 《稻田认养协议》</span>
                    </p>
                  </router-link>
                </li>
              </ul>

            </section>
          </section>
        </section>
      </transition>
    </section>

    <transition
      appear
      @after-appear="afterEnter"
      @before-appear="beforeEnter"
      v-for="(item,index) in showMoveDot">
            <span class="move_dot" v-if="item">
                <svg class="move_liner">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                </svg>
            </span>
    </transition>
    <loading v-show="showLoading || loadRatings"></loading>
    <section class="animation_opactiy shop_back_svg_container" v-if="showLoading">
      <img src="../../images/shop_back_svg.svg">
    </section>

    <router-view v-if="flag||!flag"></router-view>
    <transition name="router-slid" mode="out-in" v-if="flag==undefined">
      <router-view></router-view>
    </transition>

    <!--<div class="block" :class="{blocks:flag!=undefined&&block==0}">{{flag}}{{block}}</div>-->
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import {shopDetails, foodMenu, getRatingList, ratingScores, ratingTags,goodDetails} from 'src/service/getData'
  import loading from 'src/components/common/loading'
  import buyCart from 'src/components/common/buyCart'
  import ratingStar from 'src/components/common/ratingStar'
  import {loadMore, getImgPath} from 'src/components/common/mixin'
  import {imgBaseUrl} from 'src/config/env'
  import BScroll from 'better-scroll'

  export default {
    data(){
      return{
        geohash: '', //geohash位置信息
        shopId: null, //商店id值
        showLoading: true, //显示加载动画
        changeShowType: 'food',//切换显示商品或者评价
        shopDetailData: null, //商铺详情
        showActivities: false, //是否显示活动详情
        menuList: [], //食品列表
        menuIndex: 0, //已选菜单索引值，默认为0
        menuIndexChange: true,//解决选中index时，scroll监听事件重复判断设置index的bug
        shopListTop: [], //商品列表的高度集合
        TitleDetailIndex: null, //点击展示列表头部详情
        categoryNum: [], //商品类型右上角已加入购物车的数量
        totalPrice: 0, //总共价格
        cartFoodList: [], //购物车商品列表
        showCartList: false,//显示购物车列表
        receiveInCart: false, //购物车组件下落的圆点是否到达目标位置
        ratingList: null, //评价列表
        ratingOffset: 0, //评价获取数据offset值
        ratingScoresData: null, //评价总体分数
        ratingTagsList: null, //评价分类列表
        ratingTageIndex: 0, //评价分类索引
        preventRepeatRequest: false,// 防止多次触发数据请求
        ratingTagName: '',//评论的类型
        loadRatings: false, //加载更多评论是显示加载组件
        foodScroll: null,  //食品列表scroll
        showSpecs: false,//控制显示食品规格
        specsIndex: 0, //当前选中的规格索引值
        choosedFoods: null, //当前选中视频数据
        showDeleteTip: false, //多规格商品点击减按钮，弹出提示框
        showMoveDot: [], //控制下落的小圆点显示隐藏
        windowHeight: null, //屏幕的高度
        elLeft: 0, //当前点击加按钮在网页中的绝对top值
        elBottom: 0, //当前点击加按钮在网页中的绝对left值
        ratingScroll: null, //评论页Scroll
        imgBaseUrl,
        isShow:true,
        num:0,
        block:0,
        listHeight:[],
        scrollY: 0,
        currentIndex:0,
      }
    },
    async created(){
    this.shopId = this.$route.query.shop_id;
    this.goods_id = this.$route.query.goods_id;
    this.flag = this.$route.query.flag;
    if(this.goods_id){
      let ress = await goodDetails(this.goods_id);
      let foods = [...ress.data][0];
      this.$router.push({path:'/shop/foodDetail', query:{shopId:this.shopId,goods_id:this.goods_id,category_id:foods.category_id,key:foods.key,name:foods.name,stock:foods.stock,photo:foods.photo,desc:foods.desc,price:foods.price,member_price:foods.member_price,member_price:foods.member_price,flag:this.flag}})
      this.block=1;
    }
    this.INIT_BUYCART();
    window.addEventListener("popstate",(e)=> {
      if(this.num==0){
      if(this.$route.path=='/shop'){
        if(this.flag != undefined){
          this.$router.push({path:'/food', query:{flag:this.flag}});
          this.num++;
        }else{
          this.$router.push({path:'/shop',query:{shop_id:this.shopId}});
          this.num++;
        }
      }
    }
  }, false);
  },
  mounted(){
    this.initData();
    this.windowHeight = window.innerHeight;
  },
  mixins: [loadMore, getImgPath],
    components: {
    loading,
      ratingStar,
      buyCart,
  },
  computed: {
  ...mapState([
      'latitude','longitude','cartList'
    ]),
      promotionInfo: function (){
      return this.shopDetailData.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。'
    },
    //当前商店购物信息
    shopCart: function (){
      return {...this.cartList[this.shopId]};
    },
    //购物车中总共商品的数量
    totalNum: function (){
      let num = 0;
      this.cartFoodList.forEach(item => {
        num += item.num
    })
      return num
    }
    // currentIndex() {
    //   for (let i = 0; i < this.listHeight.length; i++) {
    //     let height1 = this.listHeight[i]
    //     let height2 = this.listHeight[i + 1]
    //     if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
    //       return i
    //     }
    //   }
    //   return 0
    // }
  },
  methods: {
  ...mapMutations([
      'RECORD_ADDRESS','ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART','RECORD_SHOPDETAIL'
    ]),
      //初始化时获取基本数据
      async initData(){
      //获取商铺信息
      let res = await shopDetails(this.shopId);
      this.shopDetailData = [...res.data];
      this.shopDetailData =this.shopDetailData[0];
      //获取商铺食品列表
      let resfood = await foodMenu(this.shopId);
      this.menuList = [...resfood.data];
      //评论列表
      let rating= await getRatingList(this.shopId);
      this.ratingList = rating.data;
      this.RECORD_SHOPDETAIL(this.shopDetailData);
      //隐藏加载动画
      this.hideLoading();
    },
    _initScroll(){
      this.menuScroll = new BScroll(this.$refs.wrapperMenu, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.menuFoodList, {
        click: true,
        probeType: 3
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
     })
    },
    _calculateHeight()
    {
      let foodList = this.$refs.menuFoodList.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
  selectMenu(index, event) {
    // if (!event._constructed) {
    //   return
    // }
    // let foodList = this.$refs.menuFoodList.getElementsByClassName('food-list-hook')
    // let el = foodList[index]
    //   console.info('el',el)
    //   console.info('foodList',foodList)

      // let el = this.listHeight[index]
      // console.info('index',index);
      this.currentIndex = index;
    this.foodsScroll.scrollTo(0,-this.listHeight[index]);
  },
  findFood(food, event) {
    if (!event._constructed) {
      return
    }
    this.findedFood = food
    this.$refs.food.show()
  },
    //控制活动详情页的显示隐藏
    showActivitiesFun(){
      this.showActivities = !this.showActivities;
    },
    //加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
    addToCart(category_id, item_id, food_id, name, price, specs){
      this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
      let elLeft = event.target.getBoundingClientRect().left;
      let elBottom = event.target.getBoundingClientRect().bottom;
      this.showMoveDot.push(true);
      this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);
    },
    //移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
    removeOutCart(category_id, item_id, food_id, name, price, specs){
      this.REDUCE_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
    },
    /**
     * 初始化和shopCart变化时，重新获取购物车改变过的数据，赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
     */
    initCategoryNum(){
      let newArr = [];
      let cartFoodNum = 0;
      this.totalPrice = 0;
      this.cartFoodList = [];
      this.menuList.forEach((item, index) => {
        if(this.shopCart && this.shopCart[item.dataproducts[0].category_id]){
        let num = 0;
        Object.keys(this.shopCart[item.dataproducts[0].category_id]).forEach((itemid) => {
          Object.keys(this.shopCart[item.dataproducts[0].category_id][itemid]).forEach((foodid) => {
          let foodItem = this.shopCart[item.dataproducts[0].category_id][itemid][foodid];
        if(foodItem){
          num += (foodItem.num != null ? foodItem.num: 0);
          this.totalPrice += foodItem.num*foodItem.price;
          if(foodItem.num > 0){
            this.cartFoodList[cartFoodNum] = [];
            this.cartFoodList[cartFoodNum].category_id = item.dataproducts[0].category_id;
            this.cartFoodList[cartFoodNum].item_id = itemid;
            this.cartFoodList[cartFoodNum].food_id = foodid;
            this.cartFoodList[cartFoodNum].num = foodItem.num;
            this.cartFoodList[cartFoodNum].price = foodItem.price;
            this.cartFoodList[cartFoodNum].name = foodItem.name;
            this.cartFoodList[cartFoodNum].specs = foodItem.specs;
            cartFoodNum ++;
          }
        }
      })
      })

        newArr[index] = num;
      }else{
        newArr[index] = 0;
      }
    })
      this.totalPrice = this.totalPrice.toFixed(2);
      this.categoryNum = [...newArr];
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
    //监听圆点是否进入购物车
    listenInCart(){
      if (!this.receiveInCart) {
        this.receiveInCart = true;
        this.$refs.cartContainer.addEventListener('animationend', () => {
          this.receiveInCart = false;
      });
        this.$refs.cartContainer.addEventListener('webkitAnimationEnd', () => {
          this.receiveInCart = false;
      })
      }
    },
    //获取不同类型的评论列表
    async changeTgeIndex(index, name){
      this.ratingTageIndex = index;
      this.ratingOffset = 0;
      this.ratingTagName = name;
      let res = await getRatingList(this.shopId, this.ratingOffset, name);
      this.ratingList = [...res];
      this.$nextTick(() => {
        this.ratingScroll.refresh();
    })
    },
    //加载更多评论
    async loaderMoreRating(){
      if (this.preventRepeatRequest) {
        return
      }
      this.loadRatings = true;
      this.preventRepeatRequest = true;
      this.ratingOffset += 10;
      let ratingDate = await getRatingList(this.shopId, this.ratingOffset, this.ratingTagName);
      this.ratingList = [...this.ratingList,...ratingDate];
      this.loadRatings = false;
      if (ratingDate.length >= 10) {
        this.preventRepeatRequest = false;
      }
    },
    //隐藏动画
    hideLoading(){
      this.showLoading = false;
    },
    //显示规格列表
    showChooseList(foods){
      if (foods) {
        this.choosedFoods = foods;
      }
      this.showSpecs = !this.showSpecs;
      this.specsIndex = 0;
    },
    //记录当前所选规格的索引值
    chooseSpecs(index){
      this.specsIndex = index;
    },
    //多规格商品加入购物车
    addSpecs(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock){
      this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
      this.showChooseList();
    },
    //显示提示，无法减去商品
    showReduceTip(){
      this.showDeleteTip = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
      this.showDeleteTip = false;
    }, 3000);
    },
    //显示下落圆球
    showMoveDotFun(showMoveDot, elLeft, elBottom){
      this.showMoveDot = [...this.showMoveDot, ...showMoveDot];
      this.elLeft = elLeft;
      this.elBottom = elBottom;
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
    })
      el.children[0].addEventListener('webkitAnimationEnd', () => {
        this.listenInCart();
    })
    },
    goback(){
      if(this.flag==undefined){
        this.$router.go(-1);
      }else{
        this.$router.push({path:'/food', query:{flag:this.flag}});
      }
    }
    },
  watch: {
    //showLoading变化时说明组件已经获取初始化数据，在下一帧nextTick进行后续操作
    showLoading: function (value){
      if (!value) {
        this.$nextTick(() => {
        this.initCategoryNum();
        this._initScroll();
        this._calculateHeight();
      })
      }
    },

    shopCart: function (value){
      this.initCategoryNum();
    },
    //购物车列表发生变化，没有商铺时，隐藏
    cartFoodList: function (value){
      if(!value.length){
        this.showCartList = false;
      }
    },
    //商品、评论切换状态
    changeShowType: function (value){
      if (value === 'rating') {
        this.$nextTick(() => {
          this.ratingScroll = new BScroll('#ratingContainer', {
          probeType: 3,
          deceleration: 0.003,
          bounce: false,
          swipeTime: 2000,
          click: true,
        });
        this.ratingScroll.on('scroll', (pos) => {
          if (Math.abs(Math.round(pos.y)) >=  Math.abs(Math.round(this.ratingScroll.maxScrollY))) {
          this.loaderMoreRating();
          this.ratingScroll.refresh();
        }
      })
      })
      }
    }
  }
  }
</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';
  @import "~font-awesome/css/font-awesome.css";

  @keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
  @-moz-keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
  @-webkit-keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
  @-o-keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
  .shop_back_svg_container{
    position: fixed;
    @include wh(100%, 100%);
    img{
      @include wh(100%, 100%);
    }
  }
  .shop_container{
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    left: 0;
    height: 100%;
  }
  .goback{
    position: fixed;
    top: 0;
    left: 0;
    width: auto;
    height: 2rem;
    z-index: 11;
    padding-top: 0.2rem;
    padding-left: 0.2rem;
  }
  .shop_detail_header{
    overflow: hidden;
    position: relative;
    .header_cover_img{
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
      filter: blur(10px);
    }
    .description_header{
      position: relative;
      z-index: 10;
      background-color: rgba(119,103,137,.43);
      padding: 0.4rem 0 0.4rem 0.4rem;
      width: 100%;
      overflow: hidden;
      .description_top{
        display: flex;
        .description_left{
          margin-right: 0.3rem;
          img{
            @include wh(2.9rem, 2.9rem);
            display: block;
            border-radius: 0.15rem;
          }
        }
        .description_right{
          flex: 1;
          .description_title{
            @include sc(.8rem, #fff);
            font-weight: bold;
            width: 100%;
            margin-bottom: 0.3rem;
          }
          .description_text{
            @include sc(.5rem, #fff);
            margin-bottom: 0.3rem;
          }
          .description_promotion{
            @include sc(.5rem, #fff);
            width: 11.5rem;
          }
        }
        .description_arrow{
          @include ct;
          right: 0.3rem;
          z-index: 11;
        }
      }
      .description_footer{
        @include fj;
        margin-top: 0.5rem;
        padding-right: 1rem;
        p{
          @include sc(.5rem, #fff);
          span{
            color: #fff;
          }
          .tip_icon{
            padding: 0 .04rem;
            border: 0.025rem solid #fff;
            border-radius: 0.1rem;
            font-size: .4rem;
            display: inline-block;
          }
        }
        .ellipsis{
          width: 84%;
        }
        .footer_arrow{
          @include wh(.45rem, .45rem);
          position: absolute;
          right: .3rem;
        }
      }
    }
  }
  .activities_details{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #262626;
    z-index: 200;
    padding: 1.25rem;
    .activities_shoptitle{
      text-align: center;
      @include sc(.8rem, #fff);
    }
    .activities_ratingstar{
      display: flex;
      justify-content: center;
      transform: scale(2.2);
      margin-top: .7rem;
    }
    .activities_list{
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      @include sc(.5rem, #fff);
      li{
        margin-bottom: .2rem;
        .activities_icon{
          padding: 0 .02rem;
          display: inline-block;
          border: 0.025rem solid #fff;
          border-radius: 0.1rem;
        }
        span{
          color: #fff;
          line-height: .6rem;
        }
      }
    }
    .activities_shopinfo{
      p{
        line-height: .7rem;
        @include sc(.5rem, #fff);
      }
    }
    .activities_title_style{
      text-align: center;
      margin-bottom: 1rem;
      span{
        @include sc(.5rem, #fff);
        border: 0.025rem solid #555;
        padding: .2rem .4rem;
        border-radius: 0.5rem;
      }

    }
    .close_activities{
      position: absolute;
      bottom: 1rem;
      @include cl;
    }
  }

  .food_container{
    display: flex;
    flex: 1;
    padding-bottom: 2rem;
  }
  .menu_container{
    display: flex;
    flex: 1;
    overflow-y: hidden;
    position: relative;
    .menu_left{
      width: 3.8rem;
      .menu_left_li{
        padding: .7rem .3rem;
        border-bottom: 0.025rem solid #ededed;
        box-sizing: border-box;
        border-left: 0.15rem solid #f8f8f8;
        position: relative;
        img{
          @include wh(.5rem, .6rem);
        }
        span{
          @include sc(.6rem, #666);
        }
        .category_num{
          position: absolute;
          top: .1rem;
          right: .1rem;
          background-color: #ff461d;
          line-height: .6rem;
          text-align: center;
          border-radius: 50%;
          border: 0.025rem solid #ff461d;
          min-width: .6rem;
          height: .6rem;
          @include sc(.5rem, #fff);
          font-family: Helvetica Neue,Tahoma,Arial;
        }
      }
      .activity_menu{
        border-left: 0.15rem solid #559035;
        background-color: #fff;
        span:nth-of-type(1){
          font-weight: bold;
        }
      }
    }
    .menu_right{
      flex: 4;
      overflow-y: auto;
      .menu_detail_header{
        width: 100%;
        padding: .7rem;
        position: relative;
        @include fj;
        align-items: center;
        .menu_detail_header_left{
          width: 11rem;
          white-space: nowrap;
          overflow: hidden;
          .menu_item_title{
            @include sc(.7rem, #666);
            font-weight: bold;
          }
          .menu_item_description{
            @include sc(.5rem, #999);
            width: 30%;
            overflow: hidden;
          }
        }
        .menu_detail_header_right{
          @include wh(.5rem, 1rem);
          display: block;
          @include bis('../../images/icon_point.png');
          background-size: 100% .4rem;
          background-position: left center;
        }
        .description_tip{
          background-color: #39373a;
          opacity: 0.95;
          @include sc(.5rem, #fff);
          position: absolute;
          top: 1.5rem;
          z-index: 14;
          width: 8rem;
          right: .2rem;
          padding: .5rem .4rem;
          border: 1px;
          border-radius: .2rem;
          span{
            color: #fff;
            line-height: .6rem;
            font-size: .55rem;
          }
        }
        .description_tip::after{
          content: '';
          position: absolute;
          @include wh(.4rem, .4rem);
          background-color: #39373a;
          top: -.5rem;
          right: .7rem;
          transform: rotate(-45deg) translateY(.41rem);
        }
      }
      .menu_detail_list{
        background-color: #fff;
        padding: .6rem .4rem;
        border-bottom: 1px solid #f8f8f8;
        position: relative;
        overflow: hidden;
        .menu_detail_link{
          display:flex;
          .menu_food_img{
            margin-right: .6rem;
            img{
              @include wh(3rem, 3rem);
              display: block;
            }
          }
          .menu_food_description{
            width: 100%;
            .food_description_head{
              @include fj;
              margin-bottom: .2rem;
              .description_foodname{
                @include sc(.7rem, #333);
              }
              .attributes_ul{
                display: flex;
                li{
                  font-size: .3rem;
                  height: .8rem;
                  line-height: .35rem;
                  padding: .1rem;
                  border: 1px solid #666;
                  border-radius: 0.3rem;
                  margin-right: .1rem;
                  transform: scale(.8);
                  p{
                    white-space: nowrap;
                  }
                }
                .attribute_new{
                  position: absolute;
                  top: 0;
                  left: 0;
                  background-color: #ff8522;
                  @include wh(2rem, 2rem);
                  display: flex;
                  align-items: flex-end;
                  transform: rotate(-45deg) translate(-.1rem, -1.5rem);
                  border: none;
                  border-radius: 0;
                  p{
                    @include sc(.4rem, #fff);
                    text-align: center;
                    flex: 1;
                  }
                }
              }
            }

            .food_price{
              span{
                display: block;
                font-family: 'Helvetica Neue',Tahoma,Arial;
              }
              span:nth-of-type(1){
                @include sc(.7rem, #f60);
                font-weight: bold;
              }
              span:nth-of-type(2){
                @include sc(.6rem, #B3B3B3);
                text-decoration:line-through;
                font-weight: bold;
              }

              span:nth-of-type(3){
                @include sc(.7rem, #f60);
                font-weight: bold;
              }
            }
            .food_description_content{
              @include sc(.5rem, #999);
              line-height: .6rem;
            }
            .food_description_sale_rating{
              line-height: .8rem;
              span{
                @include sc(.5rem, #333);
              }
            }
            .food_activity{
              line-height: .4rem;
              span{
                font-size: .3rem;
                border: 1px solid currentColor;
                border-radius: 0.3rem;
                padding: .08rem;
                display: inline-block;
                transform: scale(.8);
                margin-left: -0.35rem;

              }
            }
          }
        }
        .menu_detail_footer{
          margin-left: 2.4rem;
          font-size: 0;
          margin-top: .3rem;
          @include fj;
          .active{
            span{
              display: block;
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
        }
      }
    }
  }
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
            @include wh(.10rem, .10rem);
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
  .screen_cover{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.3);
    z-index: 11;
  }
  .screen_hide{
    z-index: -1 !important;
  }
  .change_show_type{
    display: flex;
    background-color: #fff;
    padding: .3rem 0 .6rem;
    border-bottom: 1px solid #ebebeb;
    div{
      flex: 1;
      text-align: center;
      span{
        @include sc(.65rem, #666);
        padding: .2rem .1rem;
        border-bottom: 0.12rem solid #fff;
      }
      .activity_show{
        color: #559035;
        border-color: #559035;
      }
    }
  }
  .rating_container{
    flex: 1;
    overflow-y: hidden;
    flex-direction: column;
    p, span, li, time{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
    .rating_header{
      display: flex;
      background-color: #fff;
      padding: .8rem .5rem;
      margin-bottom: 0.5rem;
      .rating_header_left{
        flex: 3;
        text-align: center;
        p:nth-of-type(1){
          @include sc(1.2rem, #f60);
        }
        p:nth-of-type(2){
          @include sc(.65rem, #666);
          margin-bottom: .1rem;
        }
        p:nth-of-type(3){
          @include sc(.4rem, #999);
        }
      }
      .rating_header_right{
        flex: 4;
        p{
          font-size: .65rem;
          line-height: 1rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          span:nth-of-type(1){
            color: #666;
            margin-right: .5rem;
          }
          .rating_num{
            width: 3rem;
            @include sc(.55rem, #f60);
          }
          .delivery_time{
            @include sc(.4rem, #999);
          }
        }
      }
    }
    .tag_list_ul{
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      padding: .5rem;
      li{
        @include sc(.6rem, #6d7885);
        padding: .3rem .3rem;
        background-color: #ebf5ff;
        border-radius: 0.2rem;
        border: 1px;
        margin: 0 .4rem .2rem 0;
      }
      .unsatisfied{
        background-color: #f5f5f5;
        color: #aaa;
      }
      .tagActivity{
        background-color: #559035;
        color: #fff;
      }
    }
    .rating_list_ul{
      background-color: #fff;
      padding: 1rem .5rem 0;
      .rating_list_li{
        /*border-top: 1px solid #f1f1f1;*/
        display: flex;
        /*padding: .6rem 0;*/
        .user_avatar{
          @include wh(1.5rem, 1.5rem);
          border: 0.025rem;
          border-radius: 50%;
          margin-right: .8rem;
        }
        .rating_list_details{
          flex: 1;
          header{
            display: flex;
            flex: 1;
            justify-content: space-between;
            margin-bottom: .3rem;
            .username_star{
              @include sc(.55rem, #666);
              .username{
                color: #666;
                margin-bottom: .2rem;
              }
              .star_desc{
                display: flex;
                align-items: center;
                .time_spent_desc{
                  @include sc(.55rem, #666);
                  margin-left: .15rem;
                }
              }
            }
            .rated_at{
              @include sc(.4rem, #999);
            }
          }
          .food_img_ul{
            display: flex;
            flex-wrap: wrap;
            margin-bottom: .4rem;
            li{
              img{
                @include wh(3rem, 3rem);
                margin-right: .4rem;
                display: block;
              }
            }
          }
          .pj_name_ul{
            font-size: .6rem !important;
          }
          .food_name_ul{
            display: flex;
            flex-wrap: wrap;
            li{
              @include sc(.55rem, #999);
              width: 2.2rem;
              padding: .2rem;
              border: 0.025rem solid #ebebeb;
              border-radius: 0.15rem;
              margin-right: .3rem;
              margin-bottom: 4px;
            }
          }
        }
      }
    }
  }
  .specs_cover{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.4);
    z-index: 17;
  }
  .specs_list{
    position: fixed;
    top: 35%;
    left: 15%;
    width: 70%;
    background-color: #fff;
    z-index: 18;
    border: 1px;
    border-radius: 0.2rem;
    .specs_list_header{
      h4{
        @include sc(.7rem, #222);
        font-weight: normal;
        text-align: center;
        padding: .5rem;
      }
      .specs_cancel{
        position: absolute;
        right: .5rem;
        top: .5rem;
      }
    }
    .specs_details{
      padding: .5rem;
      .specs_details_title{
        @include sc(.6rem, #666);
      }
      ul{
        display: flex;
        flex-wrap: wrap;
        padding: .4rem 0;
        li{
          font-size: .6rem;
          padding: .3rem .5rem;
          border: 0.025rem solid #ddd;
          border-radius: .2rem;
          margin-right: .5rem;
          margin-bottom: .2rem;
        }
        .specs_activity{
          border-color: #3199e8;
          color: #3199e8;
        }
      }
    }
    .specs_footer{
      @include fj;
      align-items: center;
      background-color: #f9f9f9;
      padding: 0.5rem;
      border: 1px;
      border-bottom-left-radius: .2rem;
      border-bottom-right-radius: .2rem;
      .specs_price{
        span{
          color: #ff6000;
        }
        span:nth-of-type(1){
          font-size: .5rem;
        }
        span:nth-of-type(2){
          font-size: .8rem;
          font-weight: bold;
          font-family: Helvetica Neue,Tahoma;
        }
      }
      .specs_addto_cart{
        @include wh(4rem, 1.3rem);
        background-color: #3199e8;
        border: 1px;
        border-radius: 0.15rem;
        @include sc(.6rem, #fff);
        text-align: center;
        line-height: 1.3rem;
      }
    }
  }
  .show_delete_tip{
    position: fixed;
    top: 50%;
    left: 15%;
    width: 70%;
    transform: translateY(-50%);
    background-color: rgba(0,0,0,.8);
    z-index: 18;
    @include sc(.65rem, #fff);
    text-align: center;
    padding: .5rem 0;
    border: 1px;
    border-radius: 0.25rem;
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
  .rating_details{
    width: 100%;
    font-size: .7rem;
    line-height: 1.4rem;
    .pj_name_ul{
      font-size: .6rem !important;
      line-height: .9rem;
      color: #333;
    }
    .rating_list_title{
      margin-bottom: .4rem;
    }
    p{
      padding-left: .3rem;
    }
    .certificate{
      width: 100%;
    }
  }
  .rating_text{
    display:inline-block;
    width: 100%;
    font-size: .7rem;
    line-height: 2.2rem;
    text-align: right;
    .look{
      font-size: .55rem;
    }
    .ry{
      font-size: .8rem;
      font-weight: 700;
      color: #ff6000;
    }
  }
  .yz{
    color:rgba(183,187,188,1);
    /*background: rgba(183,187,188,1);*/
  }
  .jz{
    color:rgba(227,162,39,1);
    /*background: rgba(227,162,39,1);*/
  }
  .bz{
    color:rgba(138,141,188,1);
    /*background: rgba(138,141,188,1);*/
  }
  .zz{
    color:rgba(128,42,42,1);
    /*background: rgba(128,42,42,1);*/
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  .fade-choose-enter-active, .fade-choose-leave-active {
    transition: opacity .5s;
  }
  .fade-choose-leave, .fade-choose-leave-active {
    display: none;
  }
  .fade-choose-enter, .fade-choose-leave-active {
    opacity: 0;
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
  .toggle-cart-enter-active, .toggle-cart-leave-active {
    transition: all .3s ease-out;
  }
  .toggle-cart-enter, .toggle-cart-leave-active {
    transform: translateY(100%);
  }
  .no-rating{
    font-size : 12px;
    text-align: center;
    color : rgb(147,153,159)
  }

</style>
