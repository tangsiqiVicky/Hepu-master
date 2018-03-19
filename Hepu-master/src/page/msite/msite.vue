<template>
    <div>
    	<head-top signin-up='msite' :head-title="profiletitle">
    	</head-top>
    	<div class="shop_list_container">
	    	<header class="shop_header">
	    	</header>
	    	<shop-list></shop-list>
    	</div>
    	<foot-guide></foot-guide>
    </div>
</template>

<script>
import {mapMutations} from 'vuex'
import headTop from 'src/components/header/head'
import footGuide from 'src/components/footer/footGuide'
import shopList from 'src/components/common/shoplist'
import {msiteFoodTypes, cityGuess} from 'src/service/getData'
import 'src/plugins/swiper.min.js'
import 'src/style/swiper.min.css'

export default {
	data(){
        return {
        	 geohash: '', // city页面传递过来的地址geohash
          profiletitle: '商家', // msiet页面头部标题
            foodTypes: [], // 食品分类列表
            hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
            imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
        }
    },
    mounted(){
    },
    components: {
    	headTop,
    	shopList,
    	footGuide,
    },
    computed: {

    },
    methods: {
    	...mapMutations([
    		'RECORD_ADDRESS', 'SAVE_GEOHASH'
    	]),
    	// 解码url地址，求去restaurant_category_id值
    	getCategoryId(url){
    		let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''));
    		if (/restaurant_category_id/gi.test(urlData)) {
    			return JSON.parse(urlData).restaurant_category_id.id
    		}else{
    			return ''
    		}
    	}
    },
    watch: {

    }
}

</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';
  .link_search{
    left: .8rem;
    @include wh(.9rem, .9rem);
    @include ct;
  }
  .msite_title{
    @include center;
    width: 50%;
    color: #fff;
    text-align: center;
    margin-left: -0.5rem;
    .title_text{
      @include sc(0.8rem, #fff);
      text-align: center;
      display: block;
    }
  }
  .msite_nav{
    padding-top: 2.1rem;
    background-color: #fff;
    border-bottom: 0.025rem solid $bc;
    height: 10.6rem;
    .swiper-container{
      @include wh(100%, auto);
      padding-bottom: 0.6rem;
      .swiper-pagination{
        bottom: 0.2rem;
      }
    }
    .fl_back{
      @include wh(100%, 100%);
    }
  }
  .food_types_container{
    display:flex;
    flex-wrap: wrap;
    .link_to_food{
      width: 25%;
      padding: 0.3rem 0rem;
      @include fj(center);
      figure{
        img{
          margin-bottom: 0.3rem;
          @include wh(1.8rem, 1.8rem);
        }
        figcaption{
          text-align: center;
          @include sc(0.55rem, #666);
        }
      }
    }
  }
  .shop_list_container{
    margin-top: 2rem;
    border-top: 0.025rem solid $bc;
    background-color: #fff;
    position: relative;
    top: .0rem;
    bottom: 2rem;
    .shop_header{
      .shop_icon{
        fill: #999;
        margin-left: 0.6rem;
        vertical-align: middle;
        @include wh(0.6rem, 0.6rem);
      }
      .shop_header_title{
        color: #999;
        @include font(0.55rem, 1.6rem);
      }
    }
  }
</style>
