import fetch from '../config/fetch'
import {getStore} from '../config/mUtils'

/**
 * 获取首页默认地址
 */

export const cityGuess = () => fetch('/v1/cities', {
	type: 'guess'
});


/**
 * 获取首页热门城市
 */

export const hotcity = () => fetch('/v1/cities', {
	type: 'hot'
});


/**
 * 获取首页所有城市
 */

export const groupcity = () => fetch('/v1/cities', {
	type: 'group'
});


/**
 * 获取当前所在城市
 */

export const currentcity = number => fetch('/v1/cities/' + number);


/**
 * 获取搜索地址
 */

export const searchplace = (cityid, value) => fetch('/v1/pois', {
	type: 'search',
	city_id: cityid,
	keyword: value
});


/**
 * 获取msite页面地址信息
 */

export const msiteAdress = geohash => fetch('/v2/pois/' + geohash);


/**
 * 获取msite页面食品分类列表
 */

export const msiteFoodTypes = geohash => fetch('/v2/index_entry', {
	geohash,
	group_type: '1',
	'flags[]': 'F'
});


/**
 * 获取msite商铺列表
 * shops/getShopList?actiontype=getshops&longitude=&latitude=&user_id=' + user_id + '&subtype=
 */


// export const shopList = (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) => {
// 	let supportStr = '';
// 	support_ids.forEach(item => {
// 		if (item.status) {
// 			supportStr += '&support_ids[]=' + item.id;
// 		}
// 	});
// 	let data = {
// 		latitude,
// 		longitude,
// 		offset,
// 		limit: '20',
// 		'extras[]': 'activities',
// 		keyword: '',
// 		restaurant_category_id,
// 		'restaurant_category_ids[]': restaurant_category_ids,
// 		order_by,
// 		'delivery_mode[]': delivery_mode + supportStr
// 	};
// 	return fetch('/shops/getShopList', data);
// };
//http://101.69.174.15:8085/snsoftst/shops/getShopDetail?actiontype=getproducts&shop_id=&user_id=admin&products_type=&from=41&toPage=1&numperPage=20
// export const productsList = (actiontype,shop_id='',user_id='',products_type) => {
//   let data = {
//     shop_id,
//     user_id,
//     products_type,
//     actiontype:'getproducts'
//   };
//   return fetch('shops/getShopDetail', data);
// };
//
/**
 * 获取产品列表
 * http://101.69.174.15:8085/snsoftst/shops/getShopDetail?actiontype=getproducts&shop_id=&user_id=admin&products_type=&from=41&toPage=1&numperPage=20
 */
export const productsList = (shop_id,user_id,products_type) => fetch('shops/getShopDetail',{
  shop_id,
  user_id,
  products_type,
  actiontype:'getproducts'
});
/**
 * 获取商家列表
 */
export const shopList = (actiontype,latitude='', longitude='',subtype='') => fetch('shops/getShopList',{
    latitude,
    longitude,
    subtype,
    actiontype:'getshops'
});
/**
 * 获取search页面搜索结果
 *  * http://101.69.174.15:8080/snsoft/shops/getShopList?actiontype=getshops&longitude=&latitude=&user_id=&subtype=cosmetology&searchvalue=&fenlei=&paixu=&shaixuan=&longitude=121.48789949&latitude=31.24916171&from=41&toPage=1&numperPage=20

 */

export const searchRestaurant = (searchvalue) => fetch('shops/getShopList', {
  searchvalue,
  actiontype: 'getshops'
});



/**
 * 获取food页面的 category 种类列表
 */

export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category', {
	latitude,
	longitude
});


/**
 * 获取food页面的配送方式
 * http://101.69.174.15:8085/snsoftst/shops/getShopDetail?actiontype=getproductsType&user_id=admin&shop_id=S-2017060002&pj_level=%7B%7Bpj_level_value%7D%7D&pj_content=&slidesimg=&pj_vol=
 */

export const foodDelivery = (actiontype, shop_id='') => fetch('shops/getShopDetail', {
  actiontype:'getproductsType',
  shop_id
});


/**
 * 获取food页面的商家属性活动列表
 */

export const foodActivity = (latitude, longitude) => fetch('/shopping/v1/restaurants/activity_attributes', {
	latitude,
	longitude,
	kw: ''
});


/**
 * 获取shopDeatil页面商铺详情
 * http://101.69.174.15:8080/snsoft/shops/products?actiontype=getproductsdetail&goods_id=p-528&user_id=admin&pj_level=
 * &pj_content=&slidesimg=&pj_vol=
 */



export const goodDetails = goods_id => fetch('shops/products', {
  actiontype:'getproductsdetail',
  goods_id
});


/**
 * 获取shop页面商铺详情
 * http://101.69.174.15:8085/snsoftst/shops/products?actiontype=getproductsdetail&goods_id=p-528
 * shops/getShopDetail?actiontype=getShopDetail&user_id=U-15604578366&shop_id=S-2017060002
 */

export const shopDetails = (shop_id) => {
  let data ={
    shop_id,
    actiontype:'getShopDetail'
  }
  return fetch('shops/getShopDetail', data)
};



/**
 * 获取shop页面菜单列表
 * http://101.69.174.15:8085/snsoftst/jpnk/snjpnk?actiontype=jpnk_getshopDetail&shop_id=S-kxnc&&user_id=
 * shops/getShopDetail?actiontype=getproductsType&shop_id
 */

export const foodMenu = shop_id => fetch('jpnk/snjpnk', {
  actiontype:'jpnk_getshopDetail',
  shop_id
});

/**
 * 获取shop页面菜单详情
 * shops/getShopDetail?actiontype=getproducts&shop_id=S-2017060002&user_id=U-15604578366&products_type=%E9%A4%90%E9%A5%AE&from=161&toPage=1&numperPage=20
 */
export const foodMenuDetail = (shop_id,products_type) => fetch('shops/getShopDetail', {
  actiontype:'getproducts',
  shop_id,
  products_type
});

/**
 * 获取商铺评价列表
 *
 */

export const getRatingList = (shop_id,user_id,pj_level,from,toPage,numperPage) => fetch('shops/getShopPJ' , {
  actiontype:'getShopPJ',
  shop_id,
  pj_level:'',
  from:'',
  toPage:'',
  numperPage:'',
  user_id:''

});


/**
 * 获取商铺评价分数
 */

export const ratingScores = shopid => fetch('/ugc/v2/restaurants/' + shopid + '/ratings/scores');


/**
 * 获取商铺评价分类
 *  * http://101.69.174.15:8085/snsoftst/shops/getShopPJ?actiontype=getShopPJ&shop_id=S-kf&user_id=U-15604578366&pj_level=&from=161&toPage=1&numperPage=20

 */

export const ratingTags = shop_id => fetch('shops/getShopPJ' + shop_id );


/**
 * 获取短信验证码
 * user/phoneVolid?mobile
 */

export const mobileCode = phone => fetch('user/getmobvalidno', {
	mobile: phone,
});


/**
 * 获取图片验证码
 */

export const getcaptchas = () => fetch('/v1/captchas', {},'POST');


/**
 * 检测帐号是否存在
 */

// export const checkExsis = (checkNumber, type) => fetch('/v1/users/exists', {
// 	[type]: checkNumber,
// 	type
// });

// 微信支付


/**
 * 发送帐号
 */

export const sendMobile = (sendData, captcha_code, type, password) => fetch('/v1/mobile/verify_code/send', {
	action: "send",
	captcha_code,
	[type]: sendData,
	type: "sms",
	way: type,
	password,
}, 'POST');

// 微信支付
export const payWx = (openid,noncestr,timestamp, url,orderNo,userId,money,notify_url) => fetch('snwx/snWXWX/', {
  mytype:'getprepay_id',
  openid: openid,
  noncestr: noncestr,
  timestamp: timestamp,
  url:url,
  orderNo: orderNo,
  userId:userId,
  money:money,
  notify_url
});


/**
 * 确认订单
 */

export const checkout = (geohash, entities, shopid) => fetch('/v1/carts/checkout', {
	come_from: "web",
	geohash,
	entities,
	restaurant_id: shopid,
}, 'POST');


/**
 * 获取支付签名
 */
export const getjsapi_signature = (noncestr,timestamp,url) => fetch('snwx/snWXWX/', {
  mytype: 'getjsapi_signature',
  noncestr: noncestr,
  timestamp: timestamp,
  url:url,
});

/**
 * 获取快速备注列表
 */

export const getRemark = (id, sig) => fetch('/v1/carts/' + id + '/remarks', {
	sig
});


/**
 * 获取地址列表
 * shops/shoppingCart?actiontype=getshaddr&user_id=U-15604578366
 */

export const getAddress = (user_id) => fetch('shops/shoppingCart' , {
  actiontype: 'getshaddr'
});


/**
 * 搜索地址
 */

export const searchNearby = keyword => fetch('/v1/pois', {
	type: 'nearby',
	keyword
});


/**
 * 添加地址
 * http://101.69.174.15:8085/snsoftst/shops/shoppingCart?actiontype=add_shaddr&user_id=U-15604578366&shr=%E9%97%AE%E9%97%AE&addr=%E9%98%BF%E5%B0%94%E7%BB%B4%E9%A5%BF&tel=%E6%B4%92%E5%A4%A7%E5%9C%B0&remark=%E5%95%8A%E4%B8%81%E7%A1%95%E5%8F%91%E7%94%9F%E5%9C%B0%E6%96%B9
 */

export const postAddAddress = (user_id, shr,tel, addr, remark) => fetch('shops/shoppingCart', {
  actiontype: 'add_shaddr',
  user_id,
  tel,
  shr,
  addr,
  remark
});



/**
 * 下订单
 * jpnk_placeOrders&user_id=&cartInfo=&addr_id=
 */


export const placeOrders = (shop_id,user_id, cartInfo, addr_id,payWayId) => fetch('jpnk/snjpnk', {
  actiontype: 'jpnk_placeOrders',
  shop_id,
  user_id,
  cartInfo,
  addr_id,
  payWayId
}, 'POST');



/**
 * 微信支付
 * wx_notify_url.jsp?paymode=wx&out_trade_no=' + out_trade_no + '&userId=' + user_id + '&total_fee=' + total_fee
 */

export const payMode = (out_trade_no, userId,total_fee) => fetch('http://www.mycard.top/h5-js/wx_notify_url_snsoftst.jsp', {
  paymode: 'wx',
  out_trade_no,
  userId,
  total_fee,
},'POST','1');


/**
 * 微信获取AccessToken
 snwx/snWXWX?mytype=getToken
 */

export const getAccessToken = () => fetch('snwx/snWXWX', {
  mytype:'getToken',

});

/**
 * 微信获取客服
 *
 */

export const getCustom = (access_token,kf_account,openid) => fetch('snwx/snWXWX', {
  mytype:'kfSession',
  access_token,
  kf_account,
  openid

});
// export const getCustom = (access_token,kf_account,openid) => fetch('https://api.weixin.qq.com/customservice/kfsession/create', {
//   access_token,
//   kf_account,
//   openid
// },'POST','1');

/**
 * 微信支付接口
 */

// export const payMent = () => fetch("",{
//
// },"POST")

/**
 * 重新发送订单验证码
 */

export const rePostVerify = (cart_id, sig, type) => fetch('/v1/carts/' + cart_id + '/verify_code', {
	sig,
	type,
}, 'POST');



/**
 * 下订单
 */

export const validateOrders = ({
	user_id,
	cart_id,
	address_id,
	description,
	entities,
	geohash,
	sig,
	validation_code,
	validation_token
}) => fetch('/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
	address_id,
	come_from: "mobile_web",
	deliver_time: "",
	description,
	entities,
	geohash,
	paymethod_id: 1,
	sig,
	validation_code,
	validation_token,
}, 'POST');


/**
 * 重新发送订单验证码
 */

export const payRequest = (merchantOrderNo, userId) => fetch('/payapi/payment/queryOrder', {
	merchantId: 5,
	merchantOrderNo,
	source: 'MOBILE_WAP',
	userId,
	version: '1.0.0',
});




/**
 * 获取服务中心信息
 */

export const getService = () => fetch('/v3/profile/explain');



/**
*兑换会员卡
*/

export const vipCart = (id, number, password) => fetch('/member/v1/users/' + id + '/delivery_card/physical_card/bind',{
	number,
	password
}, 'POST')



/**
 * 获取红包
*/

export const getHongbaoNum = id => fetch('/promotion/v2/users/' + id + '/hongbaos?limit=20&offset=0');



/**
 * 获取过期红包
*/


export const getExpired = id => fetch('/promotion/v2/users/' + id + '/expired_hongbaos?limit=20&offset=0');


/**
 * 兑换红包
*/

export const exChangeHongbao = (id, exchange_code, captcha_code) => fetch('/v1/users/' + id + '/hongbao/exchange',{
	exchange_code,
	captcha_code,
}, 'POST');


/**
 * 获取用户信息
 * self/firstSelf?actiontype=getuserinfo&user_id
 */
// user_id
export const getUser = (user_id) => fetch('self/firstSelf', {actiontype:'getuserinfo',user_id:(user_id? user_id : getStore("user_id"))});


/**
 * 手机号登录
 */

var sendLogin = (code, mobile, validate_token) => fetch('/v1/login/app_mobile', {
	code,
	mobile,
	validate_token
}, 'POST');


/**
 * 获取订单列表
 * getOrderList
 */

export const getOrderList = (user_id) => fetch('shops/shoppingCart', {
  actiontype:'getdata_po',
  user_id
});

/**
 * 获取订单详情
 * http://101.69.174.15:8085/snsoftst/shops/shoppingCart?actiontype=getdata_po_detail&user_id=U-15604578366&po_id=20171103-0003
 */

export const getOrderDetail = (user_id,po_id) => fetch('shops/shoppingCart' ,{
  actiontype:'getdata_po_detail',
  user_id,
  po_id
});

/**
 * 获取openid userinfo
 * url: myforwardurl(serviceRoot2 + "snwx/snWX?actiontype=get_user_id_by_oauth2_code&code="+code, serviceRoot2),
 */

export const getOpenid = (code,user_id) => fetch('snwx/snWX' ,{
  actiontype:'get_user_id_by_oauth2_code',
  code,
  user_id,
  saved:'1'
});


/**
*个人中心里编辑地址
*/

export const getAddressList = (user_id) => fetch('shops/shoppingCart' , {
  actiontype: 'getshaddr',
  user_id
});

// /**
//  *获取code
//  */
//
// export const redirectUri = (user_id) => fetch('shops/shoppingCart' , {
//   actiontype: 'getshaddr',
//   user_id
// });

/**
*个人中心里搜索地址
*/

export const getSearchAddress = (keyword) => fetch('v1/pois',{
	keyword:keyword,
	type:'nearby'
})

/**
* 删除地址
 * http://101.69.174.15:8085/snsoftst/shops/shoppingCart?actiontype=del_shaddr&theid=75
*/

export const deleteAddress = (addressid) => fetch( 'shops/shoppingCart', {
  actiontype:'del_shaddr',
  theid:addressid
})

/**
 * 删除地址
 http://101.69.174.15:8085/snsoftst/shops/shoppingCart?actiontype=del_po&user_id=admin&po_id=20171118-0003
 */

export const deletePo = (user_id,po_id) => fetch( 'shops/shoppingCart', {
  actiontype:'del_po',
  user_id:user_id,
  po_id:po_id
})

/**
 * 账号密码登录
 * user/loginwx?mytype=loginwx
 */
export const accountLogin = (login_name,login_password) => fetch('user/loginwx', {
  mytype:'loginwx',
  login_name,
  login_password


});

/**
 * 账号注册
 * http://101.69.174.15:8085/snsoftst/user/registWX?actiontype=register&issms=1&actiontype=register&invite_code=&full_name=&gender=&phone=15604578366&validno=5988&password=&password_again=&agree=true
 */
export const register = (phone, validno) => fetch('user/registWX', {
  actiontype:'register',
  agree:true,
  issms:'1',
  invite_code:'',
  full_name:'',
  gender:'',
  password:'',
  password_again:'',
  phone,
  validno
});

/**
 * 退出登录
 * user/loginwx?mytype=logout&login_name
 */
export const signout = (user_id) => fetch('user/loginwx',{
  mytype:'logout',
  user_id
});


/**
 * 改密码
 * http://101.69.174.15:8085/snsoftst/user/registWX?actiontype=resetpassword&mobile=15604578366&validno=0258&password=111111&password_again=111111
 */
export const changePassword = (mobile,validno, password, password_again) => fetch('user/registWX', {
  actiontype:'resetpassword',
  mobile,
  validno,
  password,
  password_again

  });
