<template>
  <section class="cart_module">
    <section  class="cart_button">
      <!--v-if="!foods.specifications.length"-->
      <transition name="showReduce">
                <span @click="removeOutCart(foods.category_id,foods.key, foods.name, foods.member_price,foods.stock)" v-if="foodNum">
                    <svg>
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                    </svg>
                </span>
      </transition>
      <transition name="fade">
        <span class="cart_num" v-if="foodNum">{{foodNum}}</span>
      </transition>
      <span>
      <svg class="add_icon" @touchstart="addToCart(foods.category_id,foods.key, foods.name, foods.member_price, foods.stock, $event)">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
      </svg>
        </span>
        <span class="mu" v-if="foods.unit=='亩'"> {{foods.unit}}</span>
        <span class="mu" v-else>&nbsp;&nbsp;</span>
    </section>
  </section>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  export default {
    data(){
      return{
        showMoveDot: [], //控制下落的小圆点显示隐藏
      }
    },
    mounted(){

    },
    computed: {
      ...mapState([
        'cartList'
      ]),
      /**
       * 监听cartList变化，更新当前商铺的购物车信息shopCart，同时返回一个新的对象
       */
      shopCart: function (){
        return Object.assign({},this.cartList[this.shopId]);
      },
      //shopCart变化的时候重新计算当前商品的数量
      foodNum: function (){
        let category_id = this.foods.category_id;
        let item_id = this.foods.key;
        if (this.shopCart&&this.shopCart[category_id]&&this.shopCart[category_id][item_id]) {
          let num = 0;
          Object.values(this.shopCart[category_id][item_id]).forEach((item,index) => {
           if(item){
             num += item.num;
           }
          })
          return num;
        }else {
          return 0;
        }
      },
    },
    props:['foods', 'shopId'],
    methods: {
      ...mapMutations([
        'ADD_CART','REDUCE_CART',
      ]),
      initData(){

      },
      //移出购物车
      removeOutCart(category_id,food_id, name, price, stock){
        if (this.foodNum > 0) {
          this.REDUCE_CART({shopid: this.shopId, category_id, food_id, name, price,stock});
        }
      },
      //加入购物车，计算按钮位置。
      addToCart(category_id,food_id, name, price, stock, event){
        this.ADD_CART({shopid: this.shopId, category_id, food_id, name, price, stock});
        let elLeft = event.target.getBoundingClientRect().left;
        let elBottom = event.target.getBoundingClientRect().bottom;
        this.showMoveDot.push(true);
        this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);

      }
      //显示规格列表
//            showChooseList(foodScroll){
//                this.$emit('showChooseList', foodScroll)
//            },
      //点击多规格商品的减按钮，弹出提示
//            showReduceTip(){
//                this.$emit('showReduceTip')
//            },

    },
  }
</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .mu{
    font-size: .6rem;
    line-height: .9rem;
  }
  .cart_module{
    .add_icon{
      position: relative;
      z-index: 999;
    }
    .cart_button{
      display: flex;
      align-items: center;
      span{
        padding: 0.2rem;
      }
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
    .choose_specification{
      .choose_icon_container{
        display: flex;
        align-items: center;
        .show_chooselist{
          display: block;
          @include sc(.55rem, #fff);
          padding: .1rem .2rem;
          background-color: $blue;
          border-radius: 0.2rem;
          border: 1px solid $blue;
        }
      }
    }
  }
  .showReduce-enter-active, .showReduce-leave-active {
    transition: all .3s ease-out;
  }
  .showReduce-enter, .showReduce-leave-active {
    opacity: 0;
    transform: translateX(1rem);
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .3s;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  .fadeBounce-enter-active, .fadeBounce-leave-active {
    transition: all .3s;
  }
  .fadeBounce-enter, .fadeBounce-leave-active {
    opacity: 0;
    transform: scale(.7);
  }

</style>

