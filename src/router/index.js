import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import ShopView from '@/views/ShopView.vue';
import BankAccountView from "@/views/BankAccountView.vue";
import ShopHome from "@/views/ShopHome.vue";
import ShopLogin from "@/views/ShopLogin.vue";
import ShopBuy from "@/views/ShopBuy.vue";
import ShopPay from "@/views/ShopPay.vue";
import ShopOrders from "@/views/ShopOrders.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/shop',
    component: ShopView,
    children: [
      {
        path: 'home',
        component: ShopHome,
        alias: ''
      },
      {
        path: 'login',
        component: ShopLogin
      },
      {
        path: 'buy',
        component: ShopBuy
      },
      {
        path: 'pay/:orderId',
        component: ShopPay,
        props: { shopmain: true }
      },
      {
        path: 'orders',
        component: ShopOrders
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
