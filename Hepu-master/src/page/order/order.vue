<template>
  <div class="order_page">
    <head-top head-title="订单列表" go-back='true'></head-top>
    <ul class="order_list_ul" v-load-more="loaderMore">
      <li class="order_list_no" v-if="!orderList||orderList.length === 0">暂无订单</li>
      <li class="leftSlip-wrap" v-else v-for="(item,index) in orderList" :key="item.id">
        <!--order_list_li-->
        <!--<img :src="imgBaseUrl + item.restaurant_image_url" class="restaurant_image">-->
        <section class="order_item_right left-slip-container" :style="item.txtStyle"
                 @click="showDetail(item)"
                 @touchstart="onSlipTouchStart($event)"
                 @touchmove="onSlipTouchMove($event)"
                 @touchend="onSlipTouchEnd($event)"
                 :data-index="index"
        >
          <!--<section @click="showDetail(item)">-->
            <header class="order_item_right_header">
              <section class="order_header">
                <h4 >
                  <span class="ellipsis">{{item.shop_name}} </span>
                  <svg fill="#333" class="arrow_right">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                  </svg>
                </h4>
                <p class="order_time">{{item.PO_ID}}</p>
              </section>
              <div class="order_status">
                <p class="">
                  {{item.Make_date}}
                </p>
                <div class="order_again">
                  <compute-time  :po="item" v-if="item.Status == '草拟'" ></compute-time>
                  <router-link :to="{path: '/shop', query: { shop_id: item.shop_id}}" tag="span" class="buy_again" v-else>再来一单</router-link>
                </div>
              </div>

            </header>
            <!--<section class="order_basket">-->
            <!--&lt;!&ndash;<p class="order_name ellipsis">{{item.basket.group[0][0].name}}{{item.basket.group[0].length > 1 ? ' 等' + item.basket.group[0].length + '件商品' : ''}}</p>&ndash;&gt;-->
            <!--&lt;!&ndash;<p class="order_amount">¥{{item.amount.toFixed(2)}}</p>&ndash;&gt;-->
            <!--</section>-->
          <!--</section>-->

        </section>
        <div class="del" @click="onDeleteItem(index)">删除</div>

      </li>
    </ul>
    <foot-guide></foot-guide>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>

  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import headTop from 'src/components/header/head'
  import computeTime from 'src/components/common/computeTime'
  import loading from 'src/components/common/loading'
  import {getImgPath} from 'src/components/common/mixin'
  import footGuide from 'src/components/footer/footGuide'
  import {getOrderList,deletePo} from 'src/service/getData'
  import {loadMore} from 'src/components/common/mixin'
  import {imgBaseUrl} from 'src/config/env'
  import alertTip from 'src/components/common/alertTip'


  export default {
    data(){
      return{
        orderList: null, //订单列表
        offset: 0,
        showAlert: false,
        alertText: null,
        preventRepeat: false,  //防止重复获取
        showLoading: true, //显示加载动画
        imgBaseUrl,
        startX:0,	  //  按下的位置
        moveX:0,	 //   鼠标移动时水平方向的位置
        disX:0,		//	  移动之间的距离
        delWidth:5.25
      }
    },
    created(){
//      document.title = '订单列表';
    },
    mounted(){
      this.initData();
    },
    mixins: [loadMore],
    components: {
      headTop,
      footGuide,
      loading,
      computeTime,
      alertTip
    },
    computed: {
      ...mapState([
        'userInfo', 'geohash','orderDetail'
      ]),
    },
    methods: {
      ...mapMutations([
        'SAVE_ORDER'
      ]),
      //初始化获取信息
      async initData(){
        console.info('orderDetail',this.orderDetail);
        if (this.userInfo && this.userInfo.user_id) {
          let res = await getOrderList(this.userInfo.user_id);
          console.info(this.orderList,'=====================');
          this.orderList = [...res.data];
          this.hideLoading();
        }else{
          this.hideLoading();
        }
      },
      //加载更多
      async loaderMore(){
        if (this.preventRepeat) {
          return
        }
        this.preventRepeat = true;
        this.showLoading = true;
        this.offset += 10;
        //获取信息
        let res = await getOrderList(this.userInfo.user_id);
        this.orderList = [...this.orderList, ...res];
        this.hideLoading();
        if (res.length < 10) {
          return
        }
        this.preventRepeat = false;
      },
      //显示详情页
      showDetail(item){
        this.SAVE_ORDER(item);
        this.preventRepeat = false;
        this.$router.push('/order/orderDetail');
      },
      //生产环境与发布环境隐藏loading方式不同
      hideLoading(){
        this.showLoading = false;
      },
      onSlipTouchStart (e) {
        if(e.touches.length == 1){
          this.startX = e.touches[0].clientX;
        }
      },
      onSlipTouchMove (e) {
        if(e.touches.length == 1){
          this.moveX = e.touches[0].clientX
          this.disX = this.startX - this.moveX;

          let delWidth = this.delWidth;
          let txtStyle = '';

          if (this.disX > 0 || this.disX == 0) {
            txtStyle = "left:0"
          } else if (this.disX > 0) {
            txtStyle = "left:-" + disX + "rem";
            if (this.disX >= delWidth) {
              txtStyle = "left:-" + delWidth + "rem";
            }
          }
          let idx = e.currentTarget.dataset.index;
          let list = this.orderList;
          list[idx].txtStyle = txtStyle;
        }
      },
      onSlipTouchEnd (e) {
        if (event.changedTouches.length == 1) {
          // 手指移动结束后的水平位置
          let endX = event.changedTouches[0].clientX;
          // 触摸开始与结束,手指移动的距离
          let disX = this.startX - endX;
          let delWidth = this.delWidth;
          //如果距离小于删除按钮的1/2，不显示删除按钮
          let txtStyle = disX > delWidth / 2 ? "left:-" + delWidth + "rem" : "left:0";
          //获取手指触摸的是哪一项
          let idx = event.currentTarget.dataset.index;
          let list = this.orderList;
          list[idx].txtStyle = txtStyle;
          // this.$emit('on-change',list)
        }
      },
      async onDeleteItem(index){
//        this.list.splice(index,1)
//        this.$emit('on-change',this.list)
        let res = await deletePo(this.userInfo.user_id,this.orderList[index].PO_ID);
        console.info(res.data[0].result_text,'res')
        if (res.data[0].result) {
          this.showAlert = true;
          this.alertText = res.data[0].result_text;
          this.initData();
//          if(index == this.addressIndex){
//            this.CHOOSE_ADDRESS({address:"",index:''})
//          }
        }
      }

    },
    watch: {
      userInfo: function (value) {
        if (value && value.user_id && !this.orderList) {
          this.initData();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';

  .order_page{
    background-color: #f1f1f1;
    margin-bottom: 1.95rem;
    p, span, h4{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }

  .order_list_ul{
    padding-top: 1.95rem;
    padding-bottom: 1.2rem;
    /*margin-bottom: .4rem;*/
    position: relative;
    top: .4rem;
    bottom: 4.8rem;
  }
  .order_list_no{
    text-align:center;
    font-size:0.65rem;
  }
  .leftSlip-wrap{
    display: flex;
    flex-direction: row;
    position: relative;
    height: 4.4rem;
    border-bottom: 1px solid #eaeaea;
    position: relative;
    background-color: #fff;
    display: flex;
    margin-bottom: 0.5rem;
    /*padding: .6rem .6rem 0;*/
    .restaurant_image{
      @include wh(2rem, 2rem);
      margin-right: 0.4rem;
    }
    .order_item_right{
      flex: 5;
      .order_item_right_header{

        /*border-bottom: 0.025rem solid #f5f5f5;*/
        padding-bottom: .3rem;
        @include fj;
        .order_header{
          h4{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            @include sc(.75rem, #333);
            line-height: 1rem;
            width: 12.5rem;

            .arrow_right{
              @include wh(.4rem, .4rem);
              fill: #ccc;
              margin-right: .2rem;
            }
          }
          .order_time{
            @include sc(.55rem, #999);
            line-height: .8rem;
          }
        }
        .order_status{

          @include sc(.6rem, #333);
        }
      }
      .order_basket{
        @include fj;
        line-height: 2rem;
        /*border-bottom: 0.025rem solid #f5f5f5;*/
        .order_name{
          @include sc(.6rem, #666);
          width: 10rem;
        }
        .order_amount{
          @include sc(.6rem, #f60);
          font-weight: bold;
        }
      }
      .order_again{
        text-align: right;
        line-height: 4rem;

        /*margin-top: 2.19rem;*/
        /*padding-left: 2rem;*/
        .buy_again{
          @include sc(.55rem, #559035);
          border: 0.025rem solid #559035;
          padding: .1rem .2rem;
          border-radius: .15rem;
        }
      }
    }
  }
  .left-slip-container{
    width: 100%;
    height: 4.4rem;
    background: #fff;
    position: absolute;
    left: 0;
    z-index: 1;
    display: flex;
    flex-direction: row;
    padding-top: 0.5rem;
    padding-left: 0.5rem;
  }
  .del{
    background:#ff7676;
    color:#fff;
    width:5.25rem;
    height: 4.4rem;
    line-height:4.4rem;
    text-align:center;
    font-size:0.85rem;
    position:absolute;
    right:0;
    top: 0;
    z-index:0;
  }
  .loading-enter-active, .loading-leave-active {
    transition: opacity .7s
  }
  .loading-enter, .loading-leave-active {
    opacity: 0
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
</style>
