<template>
  <div class="food_container">
    <head-top :head-title="headTitle" ></head-top>
    <section class="search_container">
      <form class="search_form">
           <span class="search_icon">
          <i class="fa fa-search"></i>
           </span>
        <input type="search" name="search" placeholder="请输入商家或美食名称" class="search_input" v-model="searchValue"   @keyup.13="searchTarget($event)" @input="checkInput">
        <!--v-model="searchValue"  @input="checkInput"-->
        <!--<input type="submit" name="submit" class="search_submit" @click.prevent="searchTarget('')">-->
        <span class="icon" @click="chooseStyle()">
             <i v-show="!flag" class="fa fa-list"></i>
             <i v-show="flag" class="fa fa-th-large"></i>
          </span>
      </form>
    </section>
    <section class="sort_container">
      <div class="sort_item" :class="{choose_type:sortBy == 'all'}" >
        <div class="sort_item_container" @click="chooseType('all')">
          <div class="sort_item_border">
            <span :class="{category_title: sortBy == 'all'}">综合</span>
          </div>
        </div>

      </div>
      <div class="sort_item" :class="{choose_type:sortBy == 'sort'}">
        <div class="sort_item_container" @click="chooseType('sort')">
          <div class="sort_item_border">
            <span :class="{category_title: sortBy == 'sort'}">销量</span>
          </div>
        </div>

      </div>
      <div class="sort_item" :class="{choose_type:sortBy == 'price'}">
        <div class="sort_item_container" @click="chooseType('price')">
          <div class="sort_item_border">
            <span :class="{category_title: sortBy == 'price'}">价格</span>

              <i class="sort_caret fa fa-caret-up" :class="{sort_active: sortByprice == 'up'}"></i>
              <i class="sort_caret fa fa-caret-down" :class="{sort_active: sortByprice == 'down'}"></i>

          </div>
        </div>

      </div>
      <div class="sort_item" :class="{choose_type:sortBy == 'activity'}">
        <div class="sort_item_container" @click="chooseType('activity')">
          <span :class="{category_title: sortBy == 'activity'}">筛选</span>

           <i class="sort_icon fa fa-caret-down"></i>
        </div>
        <transition name="showlist">
          <section v-show="sortBy == 'activity'" class="sort_detail_type filter_container">

            <section style="width: 100%;">
              <header class="filter_header_style">产品类型</header>
              <ul class="filter_ul" style="paddingBottom: .5rem;">
                <li v-for="(item,index) in Activity" :key="item.id" class="filter_li" @click="selectSupportIds(index, item.id)">
                  <svg v-show="support_ids[index].status" class="activity_svg">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                  <span class="filter_icon" :style="{color: '#' + item.icon_color, borderColor: '#' + item.icon_color}" v-show="!support_ids[index].status">{{item.icon_name}}</span>
                  <span :class="{selected_filter: support_ids[index].status}">{{item.products_type}}</span>
                </li>
              </ul>
            </section>
            <footer class="confirm_filter">
              <div class="clear_all filter_button_style" @click="clearSelect">清空</div>
              <div class="confirm_select filter_button_style" @click="confirmSelectFun">确定<span v-show="filterNum">({{filterNum}})</span></div>
            </footer>
          </section>
        </transition>

      </div>
    </section>
    <transition name="showcover">
      <div class="back_cover" v-show="sortBy=='activity'"></div>
    </transition>
    <section class="shop_list_container">
      <!--<shop-list></shop-list>-->
      <products :flag="flag" :sortByType="sortByType" :searchValue="searchValue" ></products>

      <!--<shop-list :geohash="geohash" :restaurantCategoryId="restaurant_category_id" :restaurantCategoryIds="restaurant_category_ids" :sortByType='sortByType' :deliveryMode="delivery_mode" :confirmSelect="confirmStatus" :supportIds="support_ids" v-if="latitude" @DidConfrim="clearAll"></shop-list>-->
    </section>
    <!--<section class="search_history" v-if="searchHistory.length&&showHistory">-->
      <!--<h4 class="title_restaurant">搜索历史</h4>-->
      <!--<ul>-->
        <!--<li v-for="(item, index) in searchHistory" :key="index" class="history_list">-->
          <!--<span class="history_text ellipsis" @click="searchTarget(item)">{{item}}</span>-->
          <!--<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="delete_icon" @click="deleteHistory(index)">-->
            <!--<line x1="8" y1="8" x2="18" y2="18" style="stroke:#999;stroke-width:3" />-->
            <!--<line x1="18" y1="8" x2="8" y2="18" style="stroke:#999;stroke-width:3" />-->
          <!--</svg>-->
        <!--</li>-->
      <!--</ul>-->
      <!--<footer class="clear_history" @click="clearAllHistory">清空搜索历史</footer>-->
    <!--</section>-->
    <div class="search_none" v-if="emptyResult">很抱歉！无搜索结果</div>
    <foot-guide v-show="sortBy!='activity'"></foot-guide>

  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import headTop from 'src/components/header/head'
  import shopList from 'src/components/common/shoplist'
  import products from 'src/components/common/products'
  import footGuide from 'src/components/footer/footGuide'
  import {getImgPath} from 'src/components/common/mixin'
  import { foodCategory, foodDelivery, foodActivity,searchRestaurant} from 'src/service/getData'

  export default {
    data(){
      return {
        geohash: '', // city页面传递过来的地址geohash
        headTitle: '', // msiet页面头部标题
        foodTitle: '', // 排序左侧头部标题
        restaurant_category_id: '', // 食品类型id值
        restaurant_category_ids: '', //筛选类型的id
        sortBy: '', // 筛选的条件
        category: null, // category分类左侧数据
        categoryDetail: null, // category分类右侧的详细数据
        sortByType: null, // 根据何种方式排序
        Delivery: null, // 配送方式数据
        Activity: null, // 商家支持活动数据
        delivery_mode: null, // 选中的配送方式
        support_ids: [], // 选中的商铺活动列表
        filterNum: 0, // 所选中的所有样式的集合
        confirmStatus: false, // 确认选择
        flag:true,
        searchValue: '', // 搜索内容
        searchHistory: [], // 搜索历史记录
        showHistory: true, // 是否显示历史记录，只有在返回搜索结果后隐藏
        emptyResult: false, // 搜索结果为空时显示
        sortByprice:'',
        restaurantList:[]
      }
    },
    created(){
      if(this.$route.query.flag==undefined){
        this.flag = true;
      }else{
        this.flag = this.$route.query.flag;
      }
      this.initData();
    },
    mixins: [getImgPath],
    components: {
      headTop,
      shopList,
      footGuide,
      products
    },
    computed: {
      ...mapState([
        'latitude','longitude'
      ])
    },
    methods: {
      ...mapMutations([
        'RECORD_ADDRESS'
      ]),
      //初始化获取数据
      async initData(){
        //获取从msite页面传递过来的参数
        this.headTitle = '全部商品';
        //获取筛选产品分类
        let res = await foodDelivery();
        this.Activity = [...res.data];
        //记录support_ids的状态，默认不选中，点击状态取反，status为true时为选中状态
        this.Activity.forEach((item, index) => {
          this.support_ids[index] = {status: false, id: item.id};
        })
      },
      // 点击顶部三个选项，展示不同的列表，选中当前选项进行展示，同时收回其他选项
      async chooseType(type){

        if(this.sortBy !== type){
          //第一次点击
          this.sortBy = type;
          this.sortByType = type;
          if(type == 'price'){
            this.sortByprice ='up'
            this.sortByType = type + 'up';
          }

        }else{
          //第二次点击
          if(type == 'price') {
            if (this.sortByprice == 'up') {
              this.sortByprice = 'down'
              this.sortByType = type + 'down';
            } else {
              this.sortByprice = 'up'
              this.sortByType = type + 'up';
            }
          }else{
            this.sortBy = type;
          }
        }


      },
      //两种纬度摆放显示
      async chooseStyle(){
        this.flag=!this.flag;
        this.$router.push({path:'/food', query:{flag:this.flag}});
        },



      //点击商家产品类型，状态取反
      selectSupportIds(index, id){
        //数组替换新的值
        this.support_ids.splice(index, 1, {status: !this.support_ids[index].status, id});
        //重新计算filterNum的个数
        this.filterNum = this.delivery_mode == null? 0 : 1;
        this.support_ids.forEach(item => {
          if (item.status) {
            this.filterNum ++ ;
          }
        })
      },
      //点击取消或者确认时，需要清空当前已选的状态值
      clearAll(){
        this.delivery_mode = null;
        // this.support_ids.map(item => item.status = false);
        //          this.filterNum = 0;
      },
      //只有点击清空按钮才清空数据，否则一直保持原有状态
      clearSelect(){
        this.support_ids.map(item => item.status = false);
        this.filterNum = 0;
      },
      //点击确认时，将需要筛选的id值传递给子组件，并且收回列表
      confirmSelectFun(){
        //状态改变时，因为子组件进行了监听，会重新获取数据进行筛选
        this.confirmStatus = !this.confirmStatus;
        this.sortBy = '';
      },
      //点击提交按钮，搜索结果并显示，同时将搜索内容存入历史记录
      async searchTarget(event){
        //隐藏历史记录
        this.showHistory = false;
        this.searchValue = event.target.getAttribute('data');

      },
      //搜索结束后，删除搜索内容直到为空时清空搜索结果，并显示历史记录
      checkInput(){
        if (this.searchValue === '') {
          this.showHistory = true; //显示历史记录
          this.restaurantList = []; //清空搜索结果
          this.emptyResult = false; //隐藏搜索为空提示
        }
      },
      //点击删除按钮，删除当前历史记录
      deleteHistory(index){
        this.searchHistory.splice(index, 1);
        setStore('searchHistory',this.searchHistory);
      },
      //清除所有历史记录
      clearAllHistory(){
        this.searchHistory = [];
        setStore('searchHistory',this.searchHistory);
      }
    }

  }

</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';
  .food_container{
    padding-top: 3.6rem;
  }
  .search_container{
    background-color: #efefef;
    border-bottom: 0.025rem solid #f1f1f1;
    position: fixed;
    top: 1.95rem;
    width: 100%;
    z-index: 17;
    .search_form{
      background-color: #fff;
      padding: 0.2rem;
      display: flex;
      input{
        height: 1.5rem;
      }
      .search_icon{
        position: absolute;
        left: 0.36rem;
        top:0.2rem;
        i{
          color: #acacac;
          font-size:.9rem;
        }
      }
      .search_input{
        flex: 8;
        @include sc(0.65rem, #333);
        border-radius: 0.125rem;
        background-color: #f2f2f2;
        font-weight: bold;
        padding: 0 1.3rem;
      }
      .icon{
        flex: 1;
        text-align: center;
        /*margin-left: .2rem;*/
        padding: 0 0.25rem;
        i{
          color: #acacac;
          font-size:.9rem;
        }
      }

    }
  }
  .sort_container{
    background-color: #fff;
    border-bottom: 0.025rem solid #f1f1f1;
    position: fixed;
    /*top: 3.9rem;*/
    right: 0;
    width: 100%;
    display: flex;
    z-index: 13;
    box-sizing: border-box;
    .sort_item{
      @include sc(0.55rem, #444);
      @include wh(33.3%, 1.6rem);
      text-align: center;
      line-height: 1rem;
      .sort_item_container{
        @include wh(100%, 100%);
        position: relative;
        z-index: 14;
        background-color: #fff;
        box-sizing: border-box;
        padding-top: .3rem;
        .sort_item_border{
          position: relative;
          height: 1rem;
          border-right: 0.025rem solid $bc;
        }
      }
      .sort_icon{
        vertical-align: middle;
        transition: all .3s;
        color:#666;
      }
      .sort_caret{
         display: block;
         width:0.55rem ;
         line-height: 0.32rem;
         color:#666;
         position: relative;
         left: 3rem;
         top:-0.75rem;
       }

    }
    .choose_type{
      .sort_item_container{

        .category_title{
          color: $blue;
        }
        .sort_icon{
          transform: rotate(180deg);
          color:$blue;
        }
        .sort_active{
          color:$blue;
        }
      }
    }
    .showlist-enter-active, .showlist-leave-active {
      transition: all .3s;
      transform: translateY(0);
    }
    .showlist-enter, .showlist-leave-active {
      opacity: 0;
      transform: translateY(-100%);
    }
    .sort_detail_type{
      width: 100%;
      position: absolute;
      display:flex;
      top: 1.6rem;
      left: 0;
      border-top: 0.025rem solid $bc;
      background-color: #fff;
    }
    .category_container{
      .category_left{
        flex: 1;
        background-color: #f1f1f1;
        height: 16rem;
        overflow-y: auto;
        span{
          @include sc(0.5rem, #666);
          line-height: 1.8rem;
        }
        .category_left_li{
          @include fj;
          padding:0 0.5rem;
          .category_icon{
            @include wh(.8rem, .8rem);
            vertical-align: middle;
            margin-right: .2rem;
          }
          .category_count{
            background-color: #ccc;
            @include sc(.4rem, #fff);
            padding: 0 .1rem;
            border: 0.025rem solid #ccc;
            border-radius: 0.8rem;
            vertical-align: middle;
            margin-right: 0.25rem;
          }
          .category_arrow{
            vertical-align: middle;
          }
        }
        .category_active{
          background-color: #fff;
        }
      }
      .category_right{
        flex: 1;
        background-color: #fff;
        padding-left: 0.5rem;
        height: 16rem;
        overflow-y: auto;
        .category_right_li{
          @include fj;
          height: 1.8rem;
          line-height: 1.8rem;
          padding-right: 0.5rem;
          border-bottom: 0.025rem solid $bc;
          span{
            color: #666;
          }
        }
        .category_right_choosed{
          span{
            color: $blue;
          }
        }
      }
    }
    .sort_list_container{
      width: 100%;
      .sort_list_li{
        height: 2.5rem;
        display: flex;
        align-items: center;
        svg{
          @include wh(0.7rem, 0.7rem);
          margin:0 .3rem 0 .8rem;
        }
        p{
          line-height: 2.5rem;
          flex: auto;
          text-align: left;
          text-indent: 0.25rem;
          border-bottom: 0.025rem solid $bc;
          @include fj;
          align-items: center;
          span{
            color: #666;
          }
        }
        .sort_select{
          span{
            color: $blue;
          }
        }
      }
    }
    .filter_container{
      flex-direction: column;
      align-items: flex-start;
      min-height: 6.6rem;
      background-color: #f1f1f1;
      .filter_header_style{
        @include sc(0.4rem, #333);
        line-height: 1.5rem;
        height: 1.5rem;
        text-align: left;
        padding-left: .5rem;
        background-color: #fff;
      }
      .filter_ul{
        display: flex;
        flex-wrap: wrap;
        padding: 0 0.5rem;
        background-color: #fff;
        .filter_li{
          display: flex;
          align-items: center;
          border: 0.025rem solid #eee;
          @include wh(4.7rem, 1.4rem);
          margin-right: 0.25rem;
          border-radius: 0.125rem;
          padding: 0 0.25rem;
          margin-bottom: 0.25rem;
          svg{
            @include wh(.8rem, .8rem);
            margin-right: 0.125rem;
          }
          span{
            @include sc(0.4rem, #333);
          }
          .filter_icon{
            @include wh(.8rem, .8rem);
            font-size: 0.5rem;
            border: 0.025rem solid $bc;
            border-radius: 0.15rem;
            margin-right: 0.25rem;
            line-height: .8rem;
            text-align: center;
          }
          .activity_svg{
            margin-right: .25rem;
          }
          .selected_filter{
            color: $blue;
          }
        }
      }
      .confirm_filter{
        display: flex;
        background-color: #f1f1f1;
        width: 100%;
        padding: .3rem .2rem;
        .filter_button_style{
          @include wh(50%, 1.8rem);
          font-size: 0.8rem;
          line-height: 1.8rem;
          border-radius: 0.2rem;
        }
        .clear_all{
          background-color: #fff;
          margin-right: .5rem;
          border: 0.025rem solid #fff;
        }
        .confirm_select{
          background-color: #ff8522;
          color: #fff;
          border: 0.025rem solid #ff8522;
          span{
            color: #fff;
          }
        }
      }
    }


  }
  .shop_list_container{
    position: relative;
    top: 1.6rem;

  }
  .showcover-enter-active, .showcover-leave-active {
    transition: opacity .3s
  }
  .showcover-enter, .showcover-leave-active {
    opacity: 0
  }
  .back_cover{
    position: fixed;
    @include wh(100%, 100%);
    z-index: 10;
    top:5rem;
    background-color: rgba(0,0,0,0.3);
  }
  .search_history{
    .history_list{
      background-color: #fff;
      border-bottom: 0.025rem solid $bc;
      @include font(0.7rem, 2rem);
      padding: 0 0.3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .history_text{
        display: inline-block;
        width: 80%;
      }
      .delete_icon{
        @include wh(1rem, 1rem);
      }
    }
    .clear_history{
      background-color: #fff;
      color: $blue;
      @include font(.7rem, 2rem);
      font-weight: bold;
      text-align: center;
    }
  }
  .search_none{
    margin: 0 auto;
    @include font(0.65rem, 1.75rem);
    color: #333;
    background-color: #fff;
    text-align: center;
    margin-top: 0.125rem;
  }
</style>
