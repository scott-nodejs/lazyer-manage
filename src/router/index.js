const OrderList = () => import('order/order-list/order-list')
const Login = () => import('login/login')
const GoodsList = () => import('goods/goods-list/goods-list')
const GoodsDetail = () => import('goods/goods-detail/goods-detail')
const ActivityList = () => import('activity/activity-list/activity-list.vue')
const OrderDetail = () => import('order/order-detail/order-detail')
//import {cookie} from "../common/js/cookie";

const routers = [
  {
    path: '/',
    redirect: '/order-list'
  },

  {
    path: '/order-list',
    name: 'OrderList',
    component: OrderList,
    meta: {
      title: '订单列表'
    },
  },

  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录'
    },
  },

  {
    path: '/goods-list',
    name: 'GoodsList',
    component: GoodsList,
    meta: {
      title: '商品列表'
    },
  },
  {
    path: '/activity-list',
    name: 'ActivityList',
    component: ActivityList,
    meta: {
      title: '活动列表'
    },
  },

  {
    path: '/goods-detail/:order_id/:code',
    name: 'GoodsDetail',
    component: GoodsDetail,
    meta: {
      title: '商品详情页'
    },
  },

  {
    path: '/order-detail/:order_id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: {
      title: '订单详情'
    },
  }
]

// routers.beforeEach((to, from, next)=>{
//   let islogin = cookie.get("islogin")
//   console.log(to.name)
//   if(to.name !== 'login' && islogin !== '1'){
//     if(to.name === 'resetPassword' || to.name === 'register'){
//       return next()
//     }
//     return next('/login')
//   }
//   next()
// })

export default routers
