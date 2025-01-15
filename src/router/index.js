import Vue from 'vue'
import VueRouter from 'vue-router'
import ShopView from '@/views/ShopView.vue';
import BankAccountView from "@/views/BankAccountView.vue";
import ShopHome from "@/views/ShopHome.vue";
import ShopLogin from "@/views/ShopLogin.vue";
import ShopBuy from "@/views/ShopBuy.vue";
import ShopPay from "@/views/ShopPay.vue";
import ShopOrders from "@/views/ShopOrders.vue";
import HomePage from "@/views/HomePage.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/shop',
    component: ShopView,
    children: [
      {
        path: 'home',
        component: ShopHome,
        name: 'shophome',
        alias: ''
      },
      {
        path: 'login',
        component: ShopLogin,
        name: 'shoplogin'
      },
      {
        path: 'buy',
        component: ShopBuy,
        name: 'shopbuy'
      },
      {
        path: 'pay/:orderId',
        component: ShopPay,
        props: { shopmain: true },
        name: 'shoppay'
      },
      {
        path: 'orders',
        component: ShopOrders,
        name: 'shoporders'
      }
    ]
  },
  {
    path: '/bank',
    component: BankAccountView,
    children: [
      {
        path: '/bank/account',
        name: 'bankaccount',
        component: BankAccountView
      },
    ]

  }
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
