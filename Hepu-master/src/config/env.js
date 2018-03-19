/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

// let baseUrl = '';
//let baseUrl = 'http://101.69.174.15:8085/snsoftst/';
 let baseUrl = 'https://4000214001.com/snsoft_hpxx/';
let routerMode = 'history';
let imgBaseUrl = 'http://www.mycard.top/h5-js/';


if (process.env.NODE_ENV == 'development') {

}else if(process.env.NODE_ENV == 'production'){

	// baseUrl = 'http://cangdu.org:8001';
}

export {
	baseUrl,
	routerMode,
	imgBaseUrl,
}
