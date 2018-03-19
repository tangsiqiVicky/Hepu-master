 <template>
    <div class="rating_page">
        <head-top head-title="选择地址" go-back='true'></head-top>
        <router-link to="/confirmOrder/chooseAddress/addAddress" class="add_icon_footer" >
            <img src="../../../images/add_address.png" height="24" width="24">
            <span>新增收货地址</span>
        </router-link>
        <section id="scroll_section" class="scroll_container">
            <section class="list_cotainer">
                <ul class="deliverable_address">
                    <li  class="leftSlip-wrap" v-for="(item,index) in deliverable" @click.prevent.stop="chooseAddress(item, index)">
                      <div class="left-slip-container" :style="item.txtStyle"  @touchstart="onSlipTouchStart($event)"
                             @touchmove="onSlipTouchMove($event)"
                             @touchend="onSlipTouchEnd($event)"
                             :data-index="index">
                          <svg class="choosed_address" :class="{default_address: defaultIndex == index}">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
                          </svg>
                            <header>
                                <span>{{item.shr}}</span>
                                <!--<span>{{item.sex == 1? '先生' : '女士'}}</span>-->
                               <span>{{item.tel}}</span>
                                <div class="address_detail ellipsis">
                                  <!--<span v-if="item.desc" :style="{backgroundColor: iconColor(item.addr)}">{{item.remark}}</span>-->
                                  <p>{{item.addr}}</p>
                                  <p>{{item.remark}}</p>
                                </div>
                            </header>

                        </div>
                        <div class="del" @click.prevent.stop="onDeleteItem(index)">删除</div>
                    </li>
                </ul>
                <!--<section id="out_delivery" v-if="deliverdisable.length">-->
                    <!--<header class="out_header">以下地址超出配送范围</header>-->
                    <!--<ul class="deliverable_address">-->
                        <!--<li v-for="(item,index) in deliverdisable">-->
                            <!--<svg class="choosed_address">-->
                                <!--<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>-->
                            <!--</svg>-->
                            <!--<div>-->
                                <!--<header>-->
                                    <!--<span>{{item.name}}</span>-->
                                    <!--<span>{{item.sex == 1? '先生' : '女士'}}</span>-->
                                    <!--<span>{{item.phone}}</span>-->
                                <!--</header>-->
                                <!--<div class="address_detail ellipsis">-->
                                    <!--<span v-if="item.tag" :style="{backgroundColor: '#ccc', color: '#fff'}">{{item.tag}}</span>-->
                                    <!--<p>{{item.address_detail}}</p>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</li>-->
                    <!--</ul>-->
                <!--</section>-->
            </section>
        </section>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import {mapState, mapMutations} from 'vuex'
    import {getAddress, getAddressList,deleteAddress} from 'src/service/getData'
    import alertTip from 'src/components/common/alertTip'
    import BScroll from 'better-scroll'

    export default {
      data(){
            return{
               	addressList: [], //地址列表
                deliverable: [], //有效地址列表
                deliverdisable: [], //无效地址列表
                id: null, //ID
                sig: null,
                showAlert: false,
                alertText: null,
                startX:0,	  //  按下的位置
                moveX:0,	 //   鼠标移动时水平方向的位置
                disX:0,		//	  移动之间的距离
                delWidth:5.25
            }
        },
        created(){
//            document.title = '选择地址';
            this.id = this.$route.query.id;
            this.sig = this.$route.query.sig;
        },
        components: {
            headTop,
            alertTip,
        },
        props:[],
        computed: {
            ...mapState([
                'userInfo', 'addressIndex', 'newAddress'
            ]),
            //选择地址
            defaultIndex: function (){
                if (this.addressIndex) {
                    return this.addressIndex;
                }else{
                    return 0;
                }
            }
        },
        methods: {
            ...mapMutations([
                'CHOOSE_ADDRESS'
            ]),
            //初始化信息
            async initData(){
                this.addressList = [];
                if (this.userInfo && this.userInfo.user_id) {
                  let addressList = await getAddressList(this.userInfo.user_id);
                  this.addressList = addressList.data
                  this.deliverable = [];
                  this.deliverdisable = [];
                    //将当前所有地址访问有效无效两种
                    this.addressList.forEach(item => {
                        if (item) {
                            this.deliverable.push(item);
                        }else{
                            this.deliverdisable.push(item);
                        }
                    })
                    // this.$nextTick(() => {
                    //     new BScroll('#scroll_section', {
                    //         deceleration: 0.003,
                    //         bounce: true,
                    //         swipeTime: 1800,
                    //     });
                    // })
                }
                let address = this.deliverable[0];
                this.CHOOSE_ADDRESS({address,index:0});
            },
            iconColor(name){
                switch(name){
                    case '公司': return '#ff8522';
                    case '学校': return '#559035';
                }
            },
            //选择地址
            chooseAddress(address, index){
                this.CHOOSE_ADDRESS({address, index});
                this.$router.go(-1);
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
                let list = this.deliverable;
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

                let list = this.deliverable;
                console.info(txtStyle)
                list[idx].txtStyle = txtStyle;
                // this.$emit('on-change',list)
              }
            },
          async onDeleteItem(index){

              let res = await deleteAddress(this.deliverable[index].id);
              if (res.data[0].result) {
                this.showAlert = true;
                this.alertText = res.data[0].result_text;
                this.initData();
                if(index == this.addressIndex){
                  this.CHOOSE_ADDRESS({address:"",index:''})
                }
              }
//              this.list.splice(index,1)
            }

        },
        watch: {
            userInfo: function (value) {
                if (value && value.user_id) {
                    this.initData();
                }
            },
            newAddress: function (value) {
                this.initData();
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .rating_page{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        z-index: 202;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .scroll_container{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding-top: 1.95rem;
        overflow-y: auto;
    }
    .list_cotainer{
        padding-bottom: 5rem;

    }
    .add_icon_footer{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2.5rem;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 204;
        span{
            @include sc(.7rem, $blue);
            margin-left: .3rem;
        }
    }

    #out_delivery{
        .out_header{
            @include sc(.6rem, #666);
            line-height: 1.5rem;
            padding-left: .5rem;
            background-color: #f5f5f5;
        }
        *{
            color: #ccc;
        }
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
    .leftSlip-wrap{
      display: flex;
      flex-direction: row;
      position: relative;
      height: 3rem;
      /*background: #F5F5F5;*/
      /*border-bottom: 1px solid #F5F5F5;*/
    }
    .left-slip-container{
      width: 100%;
      height: 3rem;
      background: #fff;
      position: absolute;
      left: 0;
      z-index: 1;
      display: flex;
      flex-direction: row;
        padding-top: 0.5rem;
        align-items: center;
        border-bottom: 0.025rem solid #f5f5f5;
        padding: .7rem;
        line-height: 1rem;
        .choosed_address{
          @include wh(.8rem, .8rem);
          fill: #ff8522;
          margin-right: .4rem;
          opacity: 0;
        }
        .default_address{
          opacity: 1;
        }
        header{
          @include sc(.7rem, #333);
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
            @include sc(.6rem, #777);
          }
        }
    }
    .choosed_address{
      @include wh(.8rem, .8rem);
      fill: #ff8522;
      margin-right: .4rem;
      opacity: 0;
    }
    .del{
      background:#ff7676;
      color:#fff;
      width:5.25rem;
      height: 3rem;
      line-height:3rem;
      text-align:center;
      font-size:0.85rem;
      position:absolute;
      right:0;
      top: 0;
      z-index:0;
    }
</style>
