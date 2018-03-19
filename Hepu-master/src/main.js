import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import VueResource from 'vue-resource'
import VueJsonp from 'vue-jsonp'
import vuex from 'vuex'


if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

Vue.use(VueAxios,axios)
Vue.use(VueRouter)
Vue.use(vuex)
// Vue.use(VueResource);
Vue.use(VueJsonp,5000)

// axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded'
// const router = new VueRouter({
// 	routes,
// 	mode: routerMode,
// 	strict: process.env.NODE_ENV !== 'production',
// 	scrollBehavior (to, from, savedPosition) {
// 	    if (savedPosition) {
// 		    return savedPosition
// 		} else {
// 			if (from.meta.keepAlive) {
// 				from.meta.savedPosition = document.body.scrollTop;
// 			}
// 		    return { x: 0, y: to.meta.savedPosition ||0}
// 		}
// 	}
// })

const router = new VueRouter({
  routes,
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition ||0}
    }
  }
})
new Vue({
	router,
	store,
}).$mount('#app')

